import React, { Component } from 'react'
import { Spin } from 'antd'
import '../css/Scatter.css'
import 'antd/dist/antd.css'
import { ScatterType, scatterViewType, storeType } from '../types/propsTypes'
import { connect } from 'react-redux'
import {selectTree} from './../action'

interface ScatterProps extends scatterViewType {
    selectTree: typeof selectTree,
}
interface ScatterState {
    isSelect: boolean,
}
class Scatter extends Component <ScatterProps, ScatterState>{
    private xk: number
    private xb: number
    private yk: number
    private yb: number
    private isSelecting: boolean
    private startPos: number[]
    private pos: number[]
    private width: number
    private height: number
    public constructor(props : ScatterProps) {
        super(props)
        this.xk = 0
        this.xb = 0
        this.yk = 0
        this.yb = 0
        this.isSelecting = false
        this.startPos = []
        this.pos = []
        this.width = 0
        this.height = 0
        this.state = {
            isSelect: false
        }
    }
    
    public render() : JSX.Element {
        // const {isActive, isShow, } = this.state
        const { scatterData, isLoading, isLoadingText, selectList } = this.props
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
        this.xk = 1050 / (xmax - xmin)
        this.xb = 1060 - xmax * this.xk
        this.yk = 663 / (ymax - ymin)
        this.yb = 673 - ymax * this.yk
        const legends:Array<[number, number]> = []
        let sum = 0
        if (scatterData.length !== 0) {
            labels.forEach((value: number) => {
                legends.push([sum, sum + value / scatterData.length])
                sum += value / scatterData.length
            })
        }
        // console.log(labels, legends);
        return (
            <div className='scatter-view'>
                <div className='scatter-title'>
                    Projection View
                </div>
                <div className='scatter-value'>
                    <Spin tip={isLoadingText} spinning={isLoading}  style={{
                        height: '693px'
                    }}>
                        <svg width='100%' height='693px' style={{
                            // backgroundColor: 'red'
                        }} onMouseDown={
                            (e) =>  {
                                if (this.state.isSelect) {
                                    // console.log((e.nativeEvent as any).layerX);
                                    this.isSelecting = true
                                    this.startPos = [(e.nativeEvent as any).layerX, (e.nativeEvent as any).layerY]
                                    // document.getElementById('select-border')!.style
                                }
                            }
                        } onMouseMove={
                            (e) => {
                                if (this.isSelecting && this.state.isSelect) {
                                    const newPos:number[] = [(e.nativeEvent as any).layerX, (e.nativeEvent as any).layerY]
                                    const Pos = [Math.min(this.startPos[0], newPos[0]), Math.min(this.startPos[1], newPos[1])]
                                    const width = Math.abs(this.startPos[0] - newPos[0])
                                    const height = Math.abs(this.startPos[1] - newPos[1])
                                    this.pos = Pos
                                    this.width = width
                                    this.height = height
                                    document.getElementById('select-border')!.style.width = width + 'px'
                                    document.getElementById('select-border')!.style.height = height + 'px'
                                    document.getElementById('select-border')!.style.left = Pos[0] + 'px'
                                    document.getElementById('select-border')!.style.top = Pos[1] + 'px'
                                }
                            }
                        } onMouseUp={
                            () => {
                                if (!this.isSelecting) return
                                this.selectPoints()
                                this.isSelecting = false 
                                document.getElementById('select-border')!.style.width = '0px'
                                document.getElementById('select-border')!.style.height = '0px'
                            }
                        }>
                            {
                                scatterData.map((value: ScatterType, index: number) => (
                                    <circle cx={this.xk * value['coor'][0] + this.xb} 
                                            cy={this.yk * value['coor'][1] + this.yb}
                                            r={2.5} key={'scatter' + index}
                                        style={{
                                            fill: colors[value['label']],
                                            opacity: !(value['type'] in selectList) || selectList[value['type']] === true ? 1 : 0.2
                                        }}
                                    />
                                ))
                            }
                            {
                                legends.map((value: [number, number], index: number) => (
                                    <rect x={864+value[0]*190} y={673} width={(value[1] - value[0]) * 190} height={19}
                                        key={'legend' + index}
                                        style={{
                                            fill: colors[index],
                                            // opacity: 0.2
                                        }}
                                    />
                                ))
                            }
                            
                        </svg>
                        <svg width="18" height="18" viewBox="0 0 1024 1024" style={{
                            position: 'absolute',
                            top: '5px',
                            right: '50px'
                        }} onClick={
                            () => {
                                this.setState({ isSelect: true })
                                document.getElementById('select-button')!.style.fill = '#1296db'
                            }
                        } onMouseOver={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('select-button')!.style.fill
                                document.getElementById('select-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                            }
                        } onMouseOut={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('select-button')!.style.fill
                                document.getElementById('select-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                                // document.getElementById('select-button')!.style.fill = '#515151'
                            }
                        }>
                            <path id='select-button' d="M1024 0v365.696h-73.130667V73.130667H73.130667v877.738666h292.565333V1024H0V0h1024zM475.306667 406.912l7.722666 1.066667 372.608 91.946666c36.778667 8.618667 51.2 56.533333 28.074667 87.253334l-5.12 5.845333-114.986667 115.072 258.645334 258.56-51.712 51.712-258.645334-258.56-113.92 113.92c-28.245333 28.288-77.781333 22.058667-91.093333-15.530667l-2.048-7.466666-92.032-372.608c-13.141333-36.864 21.504-74.538667 62.464-71.253334z" 
                                style={{
                                    fill: "#515151" 
                                }}
                            /> 
                        </svg>
                        <svg width="18" height="18" viewBox="0 0 1024 1024" style={{
                            position: 'absolute',
                            top: '5px',
                            right: '20px'
                        }} onClick={
                            () => {
                                this.setState({ isSelect: false })
                                this.isSelecting = false
                                document.getElementById('select-button')!.style.fill = '#515151'
                                this.props.selectTree({})
                            }
                        } onMouseOver={
                            () => {
                                document.getElementById('reset')!.style.fill = '#1296db'
                            }
                        } onMouseOut={
                            () => {
                                document.getElementById('reset')!.style.fill = '#515151'

                                
                            }
                        }>
                            <path id='reset' d="M757.76 409.6H1024V143.36h-97.28v71.68a507.904 507.904 0 1 0 84.48 399.36l-95.232-19.456A413.696 413.696 0 1 1 870.4 309.76h-112.64z" 
                                style={{
                                    fill: "#515151" 
                                }}
                            /> 
                        </svg>
                        <div id='select-border' style={{
                            zIndex: 99,
                            background: 'rgba(56,135,190,0.2)',
                            border: '1px solid #3887be',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '0px',
                            height: '0px',
                        }} onMouseUp={
                            () => {
                                if (!this.isSelecting) return

                                this.selectPoints()
                                this.isSelecting = false
                                document.getElementById('select-border')!.style.width = '0px'
                                document.getElementById('select-border')!.style.height = '0px'
                            }
                        }>
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }

    private selectPoints(): void {
        const {scatterData} = this.props
        const selectList: {[id: string]: boolean} = {}
        console.log( this.pos, this.width, this.height)
        // console.log(scatterData);
        scatterData.forEach((value: ScatterType) => {
            const {type, coor} = value
            const p = [this.xk * coor[0] + this.xb, this.yk * coor[1] + this.yb]
            // console.log(p);
            if (p[0] >= this.pos[0] && p[0] <= this.pos[0] + this.width && p[1] >= this.pos[1] && p[1] <= this.pos[1] + this.height ) {
                selectList[type] = true
                // console.log(coor);
            } else {
                selectList[type] = false
            }
        })
        // console.log(selectList);
        this.props.selectTree(selectList)
    }


}

const mapStateToProps = (state:storeType, ownProps?: any) => {
    const { scatter } = state
    return {
        ...ownProps,
        ...scatter,
    }
}

const mapDispatchToProps = {
    selectTree
}

export default connect(mapStateToProps, mapDispatchToProps)(Scatter);