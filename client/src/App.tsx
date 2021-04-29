
import React, { Component } from 'react';
import Console from './components/Console';
import Lines from './components/Lines';
import Scatter from './components/Scatter';
import './css/App.css'


interface AppProps {

}
interface AppState {

}
class App extends Component<AppProps, AppState>{
	public constructor(props: AppProps) {
		super(props)
	}

	public render(): JSX.Element {
		return (
			<div className='app'>
				<div className='left'>
					<Console />
				</div>
				<div className='center'>
					<Scatter />
					<Lines />
				</div>
			</div>
		)
	}
}
export default App;