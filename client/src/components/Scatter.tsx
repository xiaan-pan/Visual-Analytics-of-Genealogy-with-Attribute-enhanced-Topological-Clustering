import React, { Component } from 'react'
import { Spin } from 'antd'
import '../css/Scatter.css'
import 'antd/dist/antd.css'
import { ScatterType, scatterViewType, storeType } from '../types/propsTypes'
import { connect } from 'react-redux'
import {selectTree} from './../action'
import axios, { AxiosResponse } from 'axios'
import * as d3 from 'd3'

interface ScatterProps extends scatterViewType {
    selectTree: typeof selectTree,
}
interface ScatterState {
    isSelect: boolean,
    isShowGly: boolean,
    glyData: Array<d3.DefaultArcObject>,
    clusterNumber: number
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
    private labelBySelect: number
    private actions: Array<{
        type: string,
        [p: string]: any
    }>
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
        this.labelBySelect = 0
        this.actions = []
        this.state = {
            isSelect: false,
            isShowGly: false,
            glyData: [],
            clusterNumber: -1
        }
    }
    
    public render() : JSX.Element {
        // const {isActive, isShow, } = this.state
        const { scatterData, isLoading, isLoadingText, selectList } = this.props
        const colors = [
            '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99',
            '#fb6a4a', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a',
            '#08306b', '#b15928', '#8dd3c7', '#ffffb3', '#bebada',
            '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
            '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'
            
        ]
        // const colors = [
        //     '#8dd3c7', '#ffffb3', '#bebada', '#fb8072' ,'#80b1d3' ,
        //     '#fdb462' ,'#b3de69' ,'#fccde5' ,'#d9d9d9' ,'#bc80bd' ,
        //     '#ccebc5' ,'#ffed6f'
        // ]
        let labels:Array<any> = []
        for (let i = 0; i < 100; i ++) {
            labels.push({
                index: i,
                value: 0
            })
        }
        const xs:Array<number>= [], ys:Array<number> = []
        scatterData.forEach((value: ScatterType) => {
            xs.push(value['coor'][0])
            ys.push(value['coor'][1])
            labels[value['label']]['value'] += 1
        })
        labels.sort((a, b) => b['value'] - a['value'])
        const xmax = Math.max(...xs), xmin = Math.min(...xs), ymax = Math.max(...ys), ymin = Math.min(...ys)
        this.xk = 1050 / (xmax - xmin)
        this.xb = 1060 - xmax * this.xk
        this.yk = 663 / (ymax - ymin)
        this.yb = 673 - ymax * this.yk
        const legends:Array<[number, number, number]> = []
        let sum = 0
        if (scatterData.length !== 0) {
            labels.forEach((value: any) => {
                legends.push([sum, sum + value['value'] / scatterData.length, value['index']])
                sum += value['value'] / scatterData.length
            })
        }
        const arc: d3.Arc<any, d3.DefaultArcObject> = d3.arc()
        // console.log(this.xk, this.xb, this.yk, this.yb);
        return (
            <div className='scatter-view'>
                <div className='scatter-title'>
                    Projection View
                </div>
                <div className='scatter-value'>
                    <Spin tip={isLoadingText} spinning={isLoading}  style={{
                        height: '693px'
                    }}>
                        <svg width='100%' height='693px' id='scatter' style={{
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
                                            fill: colors[value['label'] % 24],
                                            opacity: !(value['type'] in selectList) || selectList[value['type']] === true ? 1 : 0.2
                                        }}
                                    />
                                ))
                            }
                            
                            {
                                legends.map((value: [number, number, number], index: number) => (
                                    <rect x={714+value[0]*340} y={673} width={(value[1] - value[0]) * 340} height={19}
                                        key={'legend' + index}
                                        style={{
                                            fill: colors[value[2] % 24],
                                            stroke: '#525252',   
                                            strokeWidth: this.state.clusterNumber === value[2] ? '1px' : '0px' 

                                        }}
                                        onClick={
                                            () => {
                                                this.selectPointsByLabel(value[2])
                                                this.labelBySelect = value[2]
                                                this.setState({clusterNumber: value[2]})
                                            }
                                        }
                                    />
                                ))
                            }
                            
                        </svg>
                        <svg width='1068px' height='693px' style={{
                            position: 'fixed',
                            top: '23px',
                            right: '2px',
                            backgroundColor: 'rgb(255, 255, 255, 0.85)',
                            display: this.state.isShowGly ? 'inline-block' : 'none'
                        }}>
                            {
                                this.state.glyData.map((value: d3.DefaultArcObject, index: number) => (
                                    <path d={arc(value) as string}  
                                        transform={`translate(${(value as any)['center'][0] === 534 ? 534 : this.xk*(value as any)['center'][0]+this.xb}, ${(value as any)['center'][1] === 346 ? 346 : this.yk*(value as any)['center'][1]+this.yb})`}
                                        style={{
                                            fill: (value as any)['color'],
                                            stroke: 'white',
                                            strokeWidth: '0.5px',
                                            // transform: 'translate(534, 346)'
                                        }}

                                    key={'gly' + index} />
                                ))
                            }
                            {
                                legends.map((value: [number, number, number], index: number) => (
                                    <rect x={714+value[0]*340} y={673} width={(value[1] - value[0]) * 340} height={19}
                                        key={'legend' + index}
                                        style={{
                                            fill: colors[value[2] % 24],
                                            stroke: '#525252',   
                                            strokeWidth: this.state.clusterNumber === value[2] ? '1px' : '0px'  
                                        }}
                                        onClick={
                                            () => {
                                                this.selectPointsByLabel(value[2])
                                                this.showGly(value[2])
                                                this.setState({clusterNumber: value[2]})

                                            }
                                        }
                                    />
                                ))
                            }
                        </svg>
                        <svg viewBox="0 0 1024 1024" width="20" height="20"  style={{
                            position: 'absolute',
                            top: '5px',
                            right: '110px',
                            zIndex: 9
                        }} onClick={
                            () => {
                                // this.setState({ isSelect: true })
                                document.getElementById('gly-button')!.style.fill = '#1296db'
                                // this.showGly(this.labelBySelect)
                                this.showGly(666)

                            }
                        } onMouseOver={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('gly-button')!.style.fill
                                document.getElementById('gly-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                            }
                        } onMouseOut={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('gly-button')!.style.fill
                                document.getElementById('gly-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                                // document.getElementById('select-button')!.style.fill = '#515151'
                            }
                        }>
                            <path id='gly-button' d="M838.144 954.88c-52.736 27.136-116.736 7.68-143.872-42.496-20.992-39.424-15.36-87.552 13.824-119.296l-40.96-77.312c-20.992 6.144-44.032 10.752-66.56 10.752-101.376 0-184.832-72.704-201.216-166.4h-84.48c-15.36 40.96-54.272 69.632-99.84 69.632-58.88 0-105.984-47.104-105.984-105.984S156.16 417.792 215.04 417.792c45.568 0 84.48 27.136 99.84 68.096h86.016c17.92-93.696 101.376-161.792 201.216-161.792 16.896 0 33.28 1.536 47.104 4.608l34.816-81.92c-33.28-28.672-44.032-77.312-25.6-119.296 22.528-54.272 84.48-80.384 139.264-57.344 54.272 22.528 80.384 84.48 57.344 139.264-17.92 42.496-58.88 66.56-101.376 65.024l-36.352 84.48c54.272 36.352 89.088 98.304 89.088 166.4 0 61.952-28.672 118.272-74.24 155.648l40.96 77.312c42.496-6.144 86.016 15.36 109.056 54.272 28.672 48.64 9.216 113.664-44.032 142.336z m0 0" 
                                style={{
                                    fill: '#515151'
                                }}
                            />
                        </svg>
                        <svg width="18" height="18" viewBox="0 0 1024 1024" style={{
                            position: 'absolute',
                            top: '5px',
                            right: '80px',
                            zIndex: 9
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
                        <svg viewBox="0 0 1024 1024" width="18" height="18" style={{
                            position: 'absolute',
                            top: '5px',
                            right: '50px',
                            zIndex: 9
                        }} onClick={
                            () => {
                                
                            }
                        } onMouseOver={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('return-button')!.style.fill
                                document.getElementById('return-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                            }
                        } onMouseOut={
                            () => {
                                if (this.state.isSelect) return
                                const color:string = document.getElementById('return-button')!.style.fill
                                document.getElementById('return-button')!.style.fill = color === 'rgb(81, 81, 81)' ? '#1296db' : '#515151'
                                // document.getElementById('select-button')!.style.fill = '#515151'
                            }
                        }>
                            <path id='return-button' d="M615.5 266.8H188.6l128.2-128.2c10.3-10.3 14.2-25.1 10.4-39.1-3.8-13.9-14.7-24.8-28.6-28.6-13.9-3.8-28.9 0.3-39.1 10.4l-172.2 172c-15 15-23.4 35.3-23.4 56.6-0.2 21.5 8.2 42.1 23.4 57.2l172.2 172.2c7.6 7.6 17.9 11.9 28.6 11.9 10.8 0 21-4.3 28.6-11.9 7.6-7.6 11.9-17.9 11.9-28.6s-4.3-21-11.9-28.6l-135-134.7h433.8c145.3 0 263.6 117.9 263.6 263.1S760.9 873.6 615.6 873.6H332.9c-22.3 0-40.5 18.2-40.5 40.5s18.2 40.5 40.5 40.5h282.5c189.9 0 344.5-154.3 344.5-344s-154.5-344-344.4-343.8" 
                                style={{
                                    fill: 'rgb(81, 81, 81)'
                                }}
                            />
                        
                        </svg>
                        <svg width="18" height="18" viewBox="0 0 1024 1024" style={{
                            position: 'absolute',
                            top: '5px',
                            right: '20px',
                            zIndex: 9
                        }} onClick={
                            () => {
                                this.setState({ isSelect: false })
                                this.isSelecting = false
                                document.getElementById('select-button')!.style.fill = '#515151'
                                this.props.selectTree({})
                                this.setState({isShowGly: false, clusterNumber: -1})
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

    public componentDidMount(): void {
        // 6.067597034837224 505.78566276608035 3.601900295104632 307.59162290470863
        axios.get('http://localhost:3000/data/path2.json')
            .then((res:AxiosResponse<any>) => {
                console.log(res.data);
            })
    }
    private selectPointsByLabel(labelBySelect: number): void {
        const {scatterData} = this.props
        const selectList: {[id: string]: boolean} = {}
        scatterData.forEach((value: ScatterType) => {
            const {type, label} = value
            selectList[type] = label === labelBySelect
        })
        // console.log(selectList);
        this.props.selectTree(selectList)
    }

    private selectPoints(): void {
        const {scatterData} = this.props
        const selectList: {[id: string]: boolean} = {}
        // console.log( this.pos, this.width, this.height)
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

    private showGly(label: number): void {
        this.setState({isShowGly: true})
        axios.get(`/getGly?cluster_index=${label}`)
            .then((res:AxiosResponse<any>) => {
                console.log(res.data);
                this.setState({glyData: res.data})

            })
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