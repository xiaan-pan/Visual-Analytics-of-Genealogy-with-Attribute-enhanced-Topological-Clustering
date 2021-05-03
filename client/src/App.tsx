
import React, { Component } from 'react';
import Console from './components/Console';
import Lines from './components/Lines';
import Scatter from './components/Scatter';
import Trees from './components/Trees';
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
					<Trees />
					<Lines />
				</div>
				<div className='center'>
					<Scatter />
				</div>
			</div>
		)
	}
}
export default App;