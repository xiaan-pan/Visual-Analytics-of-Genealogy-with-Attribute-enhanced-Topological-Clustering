import React, {Component} from 'react';
import '../css/Lines.css'

interface LinesProps {
    
}
interface LinesState {
    
}
class Lines extends Component <LinesProps, LinesState>{
    public constructor(props : LinesProps) {
        super(props)
    }
    
    public render() : JSX.Element {
        const data:Array<Array<number>> = [
            [1,55,9,56,0.46,18,6],
            [2,25,11,21,0.65,34,9],
            [3,56,7,63,0.3,14,5],
            [4,33,7,29,0.33,16,6],
            [5,42,24,44,0.76,40,16],
            [6,82,58,90,1.77,68,33],
            [7,74,49,77,1.46,48,27],
            [8,78,55,80,1.29,59,29]
        ]
        
        return (
            <div className='lines-view'>
                <div className='lines-title'>
                    Parallel Coordinate View
                </div>
                <div>
                    <svg width='100%' height='291px' style={{
                        // backgroundColor: 'red'
                    }}>
                        {
                            
                        }
                    </svg>

                </div>
            </div>
        )
    }
}
export default Lines;