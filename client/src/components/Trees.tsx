import React, {Component} from 'react';
import * as echarts from 'echarts'
import { ECharts } from 'echarts';
// import { Spin } from 'antd';

import '../css/Trees.css'
import axios, { AxiosResponse } from 'axios';
import { connect } from 'react-redux';


interface TreesProps {
    
}
interface TreesState {
    
}
class Trees extends Component <TreesProps, TreesState>{
    private myChart: ECharts | null;
    private allTrees: any;
    public constructor(props : TreesProps) {
        super(props)
        this.myChart = null;

    }
    
    public render() : JSX.Element {
        return (
            <div className='trees-view'>
                <div className="trees-title">Trees View</div>
                <div className="trees-value" id='trees-view'></div>
            </div>
        )
    }

    public componentDidMount(): void {
        this.myChart = echarts.init(document.getElementById('trees-view') as HTMLDivElement);
        axios.get('http://localhost:3000/data/subGraphs_1.json')
                .then((res: AxiosResponse<any>) => {
                    console.log(res.data)
                    this.allTrees = JSON.parse(JSON.stringify(res.data))
                })
        return //subGraphs_1
        const data = {
            // "name": "flare",
            "children": [
                {
                    "name": "flex",
                    "children": [
                        {"name": "FlareVis", "value": 4116}
                    ]
                },
                {
                    "name": "scale",
                    "children": [
                        {"name": "IScaleMap", "value": 2105},
                        {"name": "LinearScale", "value": 1316},
                        {"name": "LogScale", "value": 3151},
                        {"name": "OrdinalScale", "value": 3770},
                        {"name": "QuantileScale", "value": 2435},
                        {"name": "QuantitativeScale", "value": 4839},
                        {"name": "RootScale", "value": 1756},
                        {"name": "Scale", "value": 4268},
                        {"name": "ScaleType", "value": 1821},
                        {"name": "TimeScale", "value": 5833}
                    ]
                },
                {
                    "name": "display",
                    "children": [
                        {"name": "DirtySprite", "value": 8833}
                    ]
                }
            ]
        };
        const option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '1%',
                    left: '2%',
                    bottom: '1%',
                    right: '50%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9,
                        show: false
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
                }
            ]
        }
        this.myChart?.setOption(option)

    }

    public componentDidUpdate(): void {
        
    }
}
export default connect()(Trees);