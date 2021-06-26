import React, {Component} from 'react';
import * as echarts from 'echarts'
import { ECharts } from 'echarts';
// import { Spin } from 'antd';

import '../css/Trees.css'
import axios, { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { storeType, treesViewType } from '../types/propsTypes';


interface TreesProps extends treesViewType{
    
}
interface TreesState {
    page: number,
    type: string
}
class Trees extends Component <TreesProps, TreesState>{
    private myChart: ECharts | null;
    private allTrees: any;
    private boxplotData: any
    public constructor(props : TreesProps) {
        super(props)
        this.myChart = null;
        
        this.state = {
            page: 1,
            type: 'tree'
        }
    }
    
    public render() : JSX.Element {
        return (
            <div className='trees-view'>
                <div className="trees-title" id='trees-title'>Family Tree View</div>
                <div className="trees-value" id='trees-view'></div>
                <svg viewBox="0 0 1024 1024" width="23" height="23" style={{
                    position: 'absolute',
                    top: '103px',
                    left: '440px',
                    zIndex: 9,
                    // border: '1px solid black'
                }} onMouseOver={
                    () => {
                        document.getElementById('next')!.style.fill = '#1296db'
                    }
                } onMouseOut={
                    () => {
                        document.getElementById('next')!.style.fill = '#515151'
                    }
                } onClick={
                    () => {
                        this.setState({page: this.state.page + 1})
                    }
                }>
                    <path id='next' d="M658.24 500l-279.7-244.78a16 16 0 0 0-26.54 12v489.52a16 16 0 0 0 26.54 12L658.24 524a16 16 0 0 0 0-24z" 
                        style={{
                            fill: '#515151'
                        }}
                    />
                </svg>
                <svg viewBox="0 0 1024 1024" width="23" height="23" style={{
                    position: 'absolute',
                    top: '103px',
                    left: '415px',
                    zIndex: 9,
                    // border: '1px solid black'

                }} onMouseOver={
                    () => {
                        document.getElementById('last')!.style.fill = '#1296db'
                    }
                } onMouseOut={
                    () => {
                        document.getElementById('last')!.style.fill = '#515151'
                    }
                } onClick={
                    () => {
                        this.setState({page: this.state.page - 1})
                    }
                }>
                    <path id='last' d="M365.76 524l279.7 244.74a16 16 0 0 0 26.54-12V267.26a16 16 0 0 0-26.54-12L365.76 500a16 16 0 0 0 0 24z"
                        style={{
                            fill: '#515151'
                        }}
                    />
                </svg>
                <svg viewBox="0 0 1204 1024" width="18" height="18" style={{
                    position: 'absolute',
                    top: '106px',
                    left: '10px',
                    zIndex: 9,
                    // border: '1px solid black'
                }} onMouseOver={
                    () => {
                        document.getElementById('qie')!.style.fill = '#1296db'
                    }
                } onMouseOut={
                    () => {
                        document.getElementById('qie')!.style.fill = '#515151'
                    }
                } onClick={
                    () => {
                        // this.setState({page: this.state.page - 1})
                        this.setState({
                            type: this.state.type === 'tree' ? 'boxplot' : 'tree'
                        })
                    }
                }>
                    <path id='qie' d="M60.535438 602.360134l6.866706 0.301171L1144.451065 602.781774a60.234267 60.234267 0 0 1 0 120.468533H206.904706l152.33246 152.33246 4.999444 5.662021a60.234267 60.234267 0 0 1-90.170697 79.509232L25.298392 711.986499a60.174032 60.174032 0 0 1 4.818741-101.193568l0.481874-0.301171a67.462379 67.462379 0 0 1 8.613501-4.035696l1.023982-0.42164c8.673734-3.25265 18.010046-4.336867 27.10542-3.433353zM845.448166 17.666108a60.234267 60.234267 0 0 1 85.171253 0l248.767521 248.647053a60.174032 60.174032 0 0 1-4.818741 101.193567l-0.481875 0.301172a67.462379 67.462379 0 0 1-8.6135 4.035696l-0.542108 0.240937a59.933095 59.933095 0 0 1-27.647528 3.614056L60.234267 375.638354a60.234267 60.234267 0 1 1 0-120.468533l937.546359-0.060234-152.33246-152.272226-4.999444-5.662021a60.234267 60.234267 0 0 1 4.999444-79.509232z" 
                        style={{
                            fill: '#515151'
                        }}
                    />
                </svg>
            </div>
        )
    }

    public componentDidMount(): void {
        this.myChart = echarts.init(document.getElementById('trees-view') as HTMLDivElement);
        axios.get('http://localhost:3000/data/subGraphs_1.json')
                .then((res: AxiosResponse<any>) => {
                    // console.log(res.data)
                    this.allTrees = JSON.parse(JSON.stringify(res.data))
                })
        axios.get('http://localhost:3000/data/boxplotData.json')
                .then((res: AxiosResponse<any>) => {
                    // console.log(res.data)
                    this.boxplotData = JSON.parse(JSON.stringify(res.data))
                })
    }

    public componentDidUpdate(): void {
        // console.log(this.props)
        if (this.state.type === 'tree') {
            this.treeRender()
            // this.boxplotRender()

            return
        }
        this.boxplotRender()
    }

    private treeRender(): void {
        document.getElementById('trees-title')!.innerHTML = 'Family Tree View'
        const {selectList} = this.props
        const treesBySelect: Array<any> = []
        let k = 0
        this.allTrees.forEach((tree: any) => {
            if (treesBySelect.length >= 4) return
            
            if (selectList[tree['id']]) {
                k ++
                if (k > (this.state.page - 1) * 4 && k <= this.state.page * 4)
                    treesBySelect.push(tree)
            }
        })
        const option = {
            initialTreeDepth: 9,
            ledgend: {
                data: ['d', 'wd'],
                show: false
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: treesBySelect.map((tree: any, index: number) => ({
                type: 'tree',
                data: [tree],
                top: index < 2 ? '1%' : '53%',
                left: index%2 === 0 ?'2%' : '55%',
                bottom: index < 2 ? '53%' : '1%' ,
                right: index%2 === 0 ?'55%' : '1%',
                initialTreeDepth: 9,
                symbolSize: 7,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9,
                    show: false
                },
                itemStyle: {
                    color: '#1f78b4'
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left',
                    }
                },

                emphasis: {
                    // focus: 'descendant'
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }))
        }
        this.myChart?.setOption(option, true)
    }

    private boxplotRender(): void {
        document.getElementById('trees-title')!.innerHTML = 'Boxplot View'
        // console.log('00', this.props.selectList);
        // {"nodes": 12, "depth": 3, "AH": 0.9166666666666666}
        const {selectList} = this.props
        const data:Array<Array<number>> = [[], [], []]
        const legends:Array<string> = ['nodes', 'depth', 'AO']
        for (let id in selectList) {
            if (selectList[id]) {
                data[0].push(this.boxplotData['' + id]['nodes'])
                data[1].push(this.boxplotData['' + id]['depth'])
                data[2].push(this.boxplotData['' + id]['AH'])
            }
        }
        // console.log(data);
        const dataset:Array<Array<number>> = data.map((value: number[]) => {
            value.sort()
            const q1 = value[Math.round(value.length * 0.25)]
            const q2 = value[Math.round(value.length * 0.75)]
            const x = value[Math.round(value.length / 2)]
            console.log(q1, q2 ,x)
            return [q1 - 3 * (q2 - q1), q1, x, q2, q2 + 3 * (q2 - q1)]
        })
        // console.log(dataset);
        const option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legends
            },
            xAxis: {
                type: 'category',
                // boundaryGap: true,
                nameGap: 30,
                show: false,
                splitArea: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: [{
                type: 'value',
                name: 'Value',
                max: 540,
                min: 0,
                // boundaryGap: true,
                show: false
            },{
                type: 'value',
                name: 'Value',
                max: 12,
                min: 1,
                // boundaryGap: true,
                show: false
            },{
                type: 'value',
                name: 'Value',
                max: 1,
                min: 0.45,
                // boundaryGap: true,
                show: false
            }], 
            series: dataset.map((value: number[], index: number) => ({
                'name': legends[index],
                'type': 'boxplot',
                'yAxisIndex': index,
                'data': [value],
                'itemStyle': {
                    borderWidth: 3
                }
            }))
        };
        // console.log(option)
        this.myChart?.setOption(option, true)

    }
}


const mapStateToProps = (state: storeType, ownProps?: any) => {
    return {
        ...ownProps,
        ...state.trees
    }
}

export default connect(mapStateToProps)(Trees);