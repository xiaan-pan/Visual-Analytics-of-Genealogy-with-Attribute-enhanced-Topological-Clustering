import React, {Component} from 'react';
import { InputNumber, Button, Switch, Slider } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';

import '../css/Console.css'
import { changeClusterNumber, changeScatterLoading } from './../action'
import { connect } from 'react-redux';

interface ScatterType {
    type: number,
    coor: [number, number],
    label: number
}

interface ConsoleProps {
    changeClusterNumber: typeof changeClusterNumber,
    changeScatterLoading: typeof changeScatterLoading

}
interface ConsoleState {
    clusterNumber: number,
    scatterIsLoading: boolean,
    scatterIsLoadingText: string,
    scatterData: Array<ScatterType>,
    isSV: boolean,
    isAV: boolean,
    sv: number,
    av: number
}
class Console extends Component <ConsoleProps, ConsoleState>{
    public constructor(props : ConsoleProps) {
        super(props)
        this.state = {
            clusterNumber: 6,
            scatterIsLoading: false,
            scatterIsLoadingText: 'Reducing',
            scatterData: [],
            isSV: false,
            isAV: false,
            sv: 0.50,
            av: 0.50
        }
    }
    
    public render() : JSX.Element {
        const { clusterNumber, scatterIsLoading, scatterIsLoadingText } = this.state
        const { changeScatterLoading } = this.props
        const properties:Array<string> = ['attributes:', 'PN', 'VN', 'AA', 'TS', 'AG', 'AW', 'NN', 'AS', 'AWS']
        return (
            <div className='console-view'>
                <div className='console-title'>Control Panel</div>
                <div className='console-value'>
                    <div className='scatter-settings-view1'>
                        <div className='cluster-text'>
                            cluster number:
                        </div>
                        <InputNumber size="small" min={1} max={10} value={clusterNumber} 
                            onChange = {
                                (value:number) => {
                                    // console.log(value);
                                    this.setState({clusterNumber: value})
                                }
                            }
                            style = {{
                                width: '55px',
                                height: '25px',
                                // marginTop: '5px'
                            }}
                        />
                        <Button type="primary" loading={scatterIsLoading}
                            style = {{
                                height: '25px',
                                lineHeight: '23px',
                                padding: '0px 5px',
                                marginRight: '5px',
                                fontSize: '15px',
                                float: 'right'
                            }}
                            onClick = {
                                () => {
                                    changeScatterLoading(true, 'Projecting')
                                    setTimeout(() => {
                                        changeScatterLoading(true, 'Reducing dimensions')
                                        this.setState({scatterIsLoading: true}, () => {
                                            this.changeScatter();
                                        })
                                    }, 3000)
                                }
                            }
                        >
                            {scatterIsLoading ? scatterIsLoadingText : 'project'}
                        </Button>
                        {/* <Button type="primary" 
                            style = {{
                                height: '25px',
                                lineHeight: '23px',
                                padding: '0px 5px',
                                marginRight: '10px',
                                float: 'right',
                                fontSize: '14px'
                            }}
                            onClick = {
                                () => {
                                    this.setState({scatterIsLoading: false})
                                    changeScatterLoading(false, '降维中...')
                                }
                            }
                        >
                            取消
                        </Button> */}
                    </div>
                    <div className='scatter-settings-view2'>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={this.state.isSV}
                            size='small'
                            onChange={
                                (isSV: boolean) => {
                                    this.setState({isSV})
                                }
                            }
                        />
                        <div style={{
                            width: '180px',
                            height: '100%',
                            lineHeight: '35px',
                            fontSize: '15px',
                            fontFamily: 'Arial',
                            display: 'inline-block',
                            // backgroundColor: 'red',
                            paddingLeft: '12px'
                            // textAlign: 'center'
                        }}>
                            structure weight: [{this.state.sv.toFixed(2)}]
                        </div>
                    </div>
                    <Slider tooltipVisible={false} max={1} min={0} step={0.01} value={this.state.sv} style={{
                            width: '100px',
                            position: 'absolute',
                            top: '65px',
                            left: '210px'
                        }} onChange={
                            (sv:number) => {
                                this.setState({sv, av: 1 - sv})
                                
                            }
                        }/>
                    <div className='scatter-settings-view2'>
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={this.state.isAV}
                            size='small'
                            onChange={
                                (isAV: boolean) => {
                                    this.setState({isAV})
                                }
                            }
                        />
                        <div style={{
                            width: '180px',
                            height: '100%',
                            lineHeight: '35px',
                            fontSize: '15px',
                            fontFamily: 'Arial',
                            display: 'inline-block',
                            // backgroundColor: 'red',
                            paddingLeft: '15px'
                            // textAlign: 'center'
                        }}>
                            attribute weight: [{this.state.av.toFixed(2)}]
                        </div>
                    </div>
                    <Slider tooltipVisible={false} max={1} min={0} step={0.01} value={this.state.av} style={{
                        width: '100px',
                        position: 'absolute',
                        top: '100px',
                        left: '210px'
                    }} onChange={
                        (av:number) => {
                            this.setState({av, sv: 1 - av})
                        }
                    }/>
                    {
                        properties.map((value: string, index: number) => (
                            <div key={'property' + index} style={{
                                width: '20%',
                                height: '35px',
                                // backgroundColor: index % 2 ? 'red' : 'blue',
                                // display: 'inline-block',
                                float: 'left',
                                // marginRight: '0.3%',
                                lineHeight: index === 0  ? '35px' : '40px',
                                padding: '0px 0px 0px ' + (index % 5 === 0 ? '5px' : '12px')
                            }}>
                                <input type="checkbox" id={value} style={{
                                    display: index === 0 ? 'none' : 'inline-block'
                                }}/>
                                <div style={{
                                    height: '100%',
                                    // float: 'left',
                                    display: 'inline-block',
                                    background: 'white',
                                    marginLeft: index === 0 ? '0px' : '5px'
                                }}>
                                    {value}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    
    private changeScatter(): void {
        const { changeClusterNumber, changeScatterLoading } = this.props
        axios.get('/tsne')
            .then((res:AxiosResponse<any>) => {
                const {success} = res.data
                console.log(success);
                if (success) {
                    changeScatterLoading(true, 'Clustering')
                    this.setState({scatterIsLoadingText: 'Clustering'}, () => {
                        axios.get('/cluster?cluster_number=' + this.state.clusterNumber)
                            .then((res:AxiosResponse<any>) => {
                                const {data: scatterData} = res
                                changeClusterNumber(scatterData)
                                changeScatterLoading(false, 'Reducing dimensions')
                                this.setState({scatterIsLoading: false, scatterIsLoadingText: 'Reducing dimensions'})
                                
                            })
                    })
                }
                // this.setState({data}, () => {
                //     this.setState({isLoading: false})
                // })
            })
        // axios.get('/cluster?cluster_number=' + this.state.clusterNumber)
        //     .then((res:AxiosResponse<any>) => {
        //         const {data} = res
        //         this.setState({data}, () => {
        //             this.setState({isLoading: false})
        //         })
        //     })
    }
}
const mapDispatchToProps = {
	changeClusterNumber,
    changeScatterLoading
}

export default connect(null, mapDispatchToProps)(Console);