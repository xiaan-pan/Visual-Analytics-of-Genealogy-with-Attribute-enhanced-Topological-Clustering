import React, { Component } from 'react'
import { Spin } from 'antd'
import '../css/Scatter.css'
import 'antd/dist/antd.css'
import { ScatterType, scatterViewType, storeType } from '../types/propsTypes'
import { connect } from 'react-redux'

interface ScatterProps extends scatterViewType {
    
}
interface ScatterState {
    isActive: boolean,
    isShow: boolean,
    clusterNumber: number,
    isLoading: boolean,
    isLoadingText: string,
    data: Array<ScatterType>
}
class Scatter extends Component <ScatterProps, ScatterState>{
    public constructor(props : ScatterProps) {
        super(props)
        this.state = {
            isActive: false,
            isShow: false,
            clusterNumber: 6,
            isLoading: false,
            isLoadingText: '降维中...',
            data: []
        }
    }
    
    public render() : JSX.Element {
        // const {isActive, isShow, } = this.state
        const { scatterData, isLoading, isLoadingText } = this.props
        const colors = [
            '#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'
        ]
        const labels:Array<number> = [0, 0, 0, 0, 0, 0, 0, 0]
        const xs:Array<number>= [], ys:Array<number> = []
        scatterData.forEach((value: ScatterType) => {
            xs.push(value['coor'][0])
            ys.push(value['coor'][1])
            labels[value['label']] += 1
        })
        const xmax = Math.max(...xs), xmin = Math.min(...xs), ymax = Math.max(...ys), ymin = Math.min(...ys)
        let xk = 0, xb = 0, yk = 0, yb = 0
        xk = 580 / (xmax - xmin)
        xb = 590 - xmax * xk
        yk = 336 / (ymax - ymin)
        yb = 346 - ymax * yk
        const legends:Array<[number, number]> = []
        let sum = 0
        if (scatterData.length !== 0) {
            labels.forEach((value: number) => {
                legends.push([sum, value / scatterData.length])
                sum += value / scatterData.length
            })
        }
        console.log(labels, legends);
        return (
            <div className='scatter-view'>
                <div className='scatter-title'>
                    Projection View
                </div>
                <div className='scatter-value'>
                    <Spin tip={isLoadingText} spinning={isLoading} style={{
                        height: '100%'
                    }}>
                        <svg width='100%' height='376px' style={{
                            // backgroundColor: 'red'
                        }}>
                            {
                                scatterData.map((value: ScatterType, index: number) => (
                                    <circle cx={xk * value['coor'][0] + xb} 
                                            cy={yk * value['coor'][1] + yb}
                                            r={1.5} key={'scatter' + index}
                                        style={{
                                            fill: colors[value['label']]
                                        }}
                                    />
                                ))
                            }
                            {
                                legends.map((value: [number, number], index: number) => (
                                    <rect x={404+value[0]*190} y={356} width={(value[1] - value[0]) * 190} height={19}
                                        key={'legend' + index}
                                        style={{
                                            fill: colors[index],
                                            // opacity: 0.2
                                        }}
                                    />
                                ))
                            }
                        </svg>
                    </Spin>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state:storeType, ownProps?: any) => {
    const { scatter } = state
    return {
        ...ownProps,
        ...scatter,
    }
}

export default connect(mapStateToProps)(Scatter);