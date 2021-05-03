// import axios, { AxiosResponse } from 'axios';
import React, {Component} from 'react';
import * as echarts from 'echarts'
import '../css/Lines.css'
import { ECharts } from 'echarts';
import { connect } from 'react-redux';
import { LinesViewType, ScatterType, storeType } from '../types/propsTypes';
import { Spin } from 'antd';

interface linesDataFileType {
    type: number,
    attr: {
        [p: string]: number
    }
}

interface LinesProps extends LinesViewType {
    
}
interface LinesState {
    linesDataFile: Array<linesDataFileType>
}
class Lines extends Component <LinesProps, LinesState>{
    private myChart: ECharts | null;
    public constructor(props : LinesProps) {
        super(props)
        this.myChart = null;
        this.state = {
            linesDataFile: []
        }
    }
    
    public render() : JSX.Element {
        // const keys = ['PN', 'AA', 'VN', 'TS', 'AG']
        const {isLoading, isLoadingText} = this.props
        // const axisExtremums:Array<[number, number]> = axisData.map((value: number[]) => [Math.min(...value), Math.max(...value)])
        // const step = 437 / (axisExtremums.length - 1)
        // const xs:Array<number> = axisExtremums.map((value: [number, number], index: number) => index * step + 10)
        
        return (
            <div className='lines-view'>
                <div className='lines-title'>
                    Parallel Coordinate View
                </div>
                <Spin tip={isLoadingText} spinning={isLoading}  style={{
                    height: '100%'
                }}>
                    <div id='lines-view' style={{
                        width: '457px',
                        height: '291px',
                        // backgroundColor: 'red'
                    }}>
                    </div>
                </Spin>
                
            </div>
        )
    }

    public componentDidMount(): void {
        this.myChart = echarts.init(document.getElementById('lines-view') as HTMLDivElement);
        // axios.get('http://localhost:3000/data/linesData.json')
        //     .then((res: AxiosResponse<Array<linesDataFileType>>) => {
        //         // console.log(res.data);
        //         this.setState({linesDataFile: res.data})
        //     })
    }

    public componentDidUpdate(): void {
        // const {linesDataFile} = this.state
        // const keys = ['PN', 'AA', 'VN', 'TS', 'AG']
        const { scatterData, attrs, selectList } = this.props
        console.log(selectList);
        const colors = [
            '#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'
        ]
        const option = {    
        
            // xAxis: {},
            tooltip: {
                // trigger: 'item',
                // triggerOn: 'mousemove',
                // textStyle: {
                //     color: '#fff'
                // },
                // backgroundColor: '#030829',
            },
            parallelAxis: attrs.map((value: string, index: number) => ({
                dim: index,
                name: value
            })),
            parallel: {                         // 这是『坐标系』的定义
                left: '3%',                     // 平行坐标系的位置设置
                right: '8%',
                bottom: '10%',
                top: '15%',
                
            },
            series: {
                type: 'parallel',
                // layout: 'none',
                bottom: 10,
                right: 10,
                top: 0,
                left: 0,
                lineStyle: {
                    width: 1
                },
                data: scatterData.map((value: ScatterType) => {
                    const attr:Array<number> = attrs.map((key:string) => value['attr'][key])
                    // for (let i = 0; i < keys.length; i++) {
                    //     axisData[i].push(value['attr'][keys[i]])
                    // }
                    return {
                        name: value['type'],
                        value: attr,
                        lineStyle: {
                            color: colors[value['label']],
                            opacity: !(value['type'] in selectList) || selectList[value['type']] ? 1 : 0.01
                        }
                    }
                })
            }
        };
        this.myChart?.setOption(option)
    }

}

const mapStateToProps = (state: storeType, ownProps?: any) => {
    return {
        ...ownProps,
        ...state.lines
    }
}
export default connect(mapStateToProps)(Lines);