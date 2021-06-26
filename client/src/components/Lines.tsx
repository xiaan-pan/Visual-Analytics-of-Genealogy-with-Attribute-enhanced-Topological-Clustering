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
        const extremeValues:any = {
            'PN': [21 + 4, 0],
            'AA': [118 + 12, 8.5 - 8.5],
            'VN': [6, 1], 
            'TS': [240 + 20, 100 - 20], 
            'AG': [100 + 20, 0]
        }
        const { scatterData, attrs, selectList } = this.props
        const colors = [
            '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99',
            '#fb6a4a', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a',
            '#08306b', '#b15928', '#8dd3c7', '#ffffb3', '#bebada',
            '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
            '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'
            
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
                name: value,
                text: value,
                max: extremeValues[value][0],
                min: extremeValues[value][1],
                // inverse: true
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
                            color: !(value['type'] in selectList) || selectList[value['type']] ? colors[value['label'] % 24] : 'rgb(201, 201, 202, 0.5)',
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