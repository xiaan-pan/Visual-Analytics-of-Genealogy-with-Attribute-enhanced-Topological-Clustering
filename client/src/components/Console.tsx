import React, {Component} from 'react';
import { InputNumber, Button, Switch, Slider, Select } from 'antd'
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
    private isSelectList: Array<boolean>
    private selectList: string
    public constructor(props : ConsoleProps) {
        super(props)
        this.isSelectList = [false, false, false, false, false]
        this.selectList = ''
        this.state = {
            clusterNumber: 9,
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
        const { Option } = Select;
        const { clusterNumber, scatterIsLoading, scatterIsLoadingText } = this.state
        const { changeScatterLoading } = this.props
        const properties:Array<string> = ['PN', 'VN', 'AA', 'TS', 'AG']
        return (
            <div className='console-view'>
                <div className='console-title'>Control Panel</div>
                <div className='console-value'>
                    <div className='scatter-settings-view1'>
                        <div className='cluster-text'>
                            cluster number:
                        </div>
                        <InputNumber size="small" min={1} max={100} value={clusterNumber} 
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
                                marginRight: '3px',
                                fontSize: '15px',
                                float: 'right'
                            }}
                            onClick = {
                                () => {
                                    this.setState({scatterIsLoading: true, scatterIsLoadingText: 'Projecting'}, () => {
                                        changeScatterLoading(true, 'Projecting')
                                        setTimeout(() => {
                                            this.setState({scatterIsLoadingText: 'Reducing'}, () => {
                                                changeScatterLoading(true, 'Reducing dimensions')
                                                this.changeScatter();
                                            })
                                        
                                        }, 4000)
                                    })
                                    
                                }
                            }
                        >
                            {scatterIsLoading ? scatterIsLoadingText : 'project'}
                        </Button>
                        
                    </div>
                    
                    
                    <div style={{
                        // backgroundColor: 'red',
                        width: '100%',
                        height: '30px'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '100px',
                            fontSize: '17px',
                            marginRight: '35px'
                        }}>
                            attributes:
                        </div>
                        <Select
                            mode="multiple"
                            showArrow
                            // tagRender={tagRender}
                            defaultValue={[]}
                            // style={{ width: '340px' }}
                            options={
                                properties.map((value: string) => ({value}))
                            }
                            listItemHeight={10}
                            onChange={
                                (e:Array<string>) => {
                                    // console.log(e);
                                    properties.forEach((value: string, index: number) => {
                                        if (e.includes(value)) {
                                            this.isSelectList[index] = true
                                        } else {
                                            this.isSelectList[index] = false
                                        }
                                    })
                                }
                            }
                        />
                    </div>
                    {
                        // properties.map((value: string, index: number) => (
                        //     <div key={'property' + index} style={{
                        //         width: '20%',
                        //         height: '35px',
                        //         // backgroundColor: index % 2 ? 'red' : 'blue',
                        //         // display: 'inline-block',
                        //         float: 'left',
                        //         // marginRight: '0.3%',
                        //         lineHeight: index === 0  ? '35px' : '40px',
                        //         padding: '0px 0px 0px ' + (index % 5 === 0 ? '5px' : '12px')
                        //     }}>
                        //         <input type="checkbox" id={value} style={{
                        //             display: index === 0 ? 'none' : 'inline-block'
                        //         }}/>
                        //         <div style={{
                        //             height: '100%',
                        //             // float: 'left',
                        //             display: 'inline-block',
                        //             background: 'white',
                        //             marginLeft: index === 0 ? '0px' : '5px'
                        //         }}>
                        //             {value}
                        //         </div>
                        //     </div>
                        // ))
                    }
                </div>
            </div>
        )
    }

    public componentDidMount(): void {
        ;(document.getElementsByClassName('ant-select-multiple')[0] as any).style.width = '290px'
        // ;(document.getElementsByClassName('ant-select-multiple')[0] as any).style.height = '20px'
    }
    
    private changeScatter(): void {
        const { changeClusterNumber, changeScatterLoading } = this.props
        // axios.get('/tsne')
        //     .then((res:AxiosResponse<any>) => {
        //         const {success} = res.data
        //         console.log(success);
        //         if (success) {
        //             changeScatterLoading(true, 'Clustering')
        //             this.setState({scatterIsLoadingText: 'Clustering'}, () => {
        //                 axios.get('/cluster?cluster_number=' + this.state.clusterNumber)
        //                     .then((res:AxiosResponse<any>) => {
        //                         const {data: scatterData} = res
        //                         changeClusterNumber(scatterData)
        //                         changeScatterLoading(false, 'Reducing dimensions')
        //                         this.setState({scatterIsLoading: false, scatterIsLoadingText: 'Reducing dimensions'})
                                
        //                     })
        //             })
        //         }
        //         // this.setState({data}, () => {
        //         //     this.setState({isLoading: false})
        //         // })
        //     })
        const properties:Array<string> = ['PN', 'VN', 'AA', 'TS', 'AG']
        this.selectList = ''
        this.isSelectList.map((value: boolean, index: number) => {
            if (value) {
                this.selectList += ('_' + properties[index])
            }
        })
        setTimeout(() => {
            changeScatterLoading(true, 'Clustering')
            this.setState({scatterIsLoadingText: 'Clustering'}, () => {
                axios.get(`/cluster?cluster_number=${this.state.clusterNumber}&properties=${this.selectList}`)
                    .then((res:AxiosResponse<any>) => {
                        const {data: scatterData} = res
                        // console.log(typeof scatterData);
                        changeClusterNumber(scatterData, ['PN', 'AA', 'VN', 'TS', 'AG'])
                        changeScatterLoading(false, 'Reducing dimensions')
                        this.setState({scatterIsLoading: false, scatterIsLoadingText: 'Reducing'})
                        
                    })
            })
        }, 3_000)
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