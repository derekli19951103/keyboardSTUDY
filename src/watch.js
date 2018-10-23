/***************************************************
* CSC428/2514 - St. George, Fall 2018
*
* File: watch.js
* Summary: Watch Component
*
* The code is commented, and the comments provide information
* about what each js file is doing.
*
* Written by: Seyong Ha, Mingming Fan, Sep. 2018
*				Assignment2: Quantitative Analysis
*				Updated at: NA
****************************************************/

/**
 * Libraries
 */
import React from 'react';
import './index.css';
import TextArea from './textarea'
import KeyboardNormal from './keyboard.normal'
import KeyboardZoom from './keyboard.wip'

/**
 * Functions
 */

/**
 * @Deprecated.
 * Calculate watch size (width and height) in pixels.
 * 	if you decide to use exact AppleWatch size, use this function to get width and height.
 * @param: ppi , your device independent pixel per inch. Can be acheived from the web.
 * @param: watchSize, default apple watch size, 38mm or 42mm.
 * 			other size value will be return zero in size.
 */
const deviceIndependenceSize = (ppi,watchSize) => {
	var width,height,deviceWidthInPixel,deviceHeightInPixel;
	if(watchSize === 42){
		// AppleWatch Series 3 + size 42mm has a resolution of 312x390 px, 302 ppi
		//	DeviceSize: {Width:33.3, Height: 38.6mm}
		//	ScreenSize: {Width: 26mm , Height: 33mm}
		width = 26; height = 33;
		deviceWidthInPixel = width/25.4*ppi;
		deviceHeightInPixel = height/25.4*ppi;
		return {width: deviceWidthInPixel, height:deviceHeightInPixel};
	}else if(watchSize === 38){
		// AppleWatch Series 3 + size 38mm has a resolution of 272x340 px, 290 ppi
		// 	DeviceSize: {Width: 33.3mm, Height:42.5mm}
		//	ScreenSize: {Width: 24mm, Height: 30mm}
		width = 24; height = 30;
		deviceWidthInPixel = width/25.4*ppi;
		deviceHeightInPixel = height/25.4*ppi;
		return {width: deviceWidthInPixel, height:deviceHeightInPixel};
	}else{
		return {width:0, height:0}
	}
}

/**
 * Download user typed content and target phrases
 * you can and should add more measurements
 * that you recorded in your study into the text parameter
 * so that you can save them into a file
 * @param {*} text:
 * @param {*} name:
 * @param {*} type:
 */
function download(text, name, type) {
	// console.log(JSON.parse(text));
	var a = document.createElement("a");
	var file = new Blob([text], {type: type});
	a.href = URL.createObjectURL(file);
	a.download = name;
	a.click();
}

/**
 * Watch Class
 * This class extends React.Component
 */
class Watch extends React.Component {

	/**
	 * Constructor
	 * @param {} props: a paramater which enables you to access
	 * 			values passed from parent Componenet(or Node).
	 * 			e.g., if you pass 'value' as 5 in Watch component
	 * 				<Watch value={5}/>
	 * 				you can access by calling 'this.props.value'
	 * 				props are immutable.
	 */
	constructor(props){
		super(props);

		//Your URL parameter can be accessed with following syntax.
		console.log(this.props.type);
		console.log(this.props.type===undefined);
		this.type = (this.props.type === undefined) ? this.props.match.params.type : this.props.type;
		this.originalScale = (this.props.originalScale === undefined)?this.props.match.params.scaleVal : this.props.originalScale;

		//this.type = this.props.match.params.type;
		//this.originalScale = this.props.match.params.scaleVal;
		console.log("[Watch] type: "+this.type);
		console.log("[Watch] originalScale: "+this.originalScale);
		// React Component States.
		// inputPhrase: a variable containing all characters typed by users.
		// inputChar: a variable containing your current input character from the Keyboard.
		// if 'inputPhrase' or 'inputChar' value has changed by onKeyCharReceived(),
		// Watch Component will re-render the interface if the state has changed by calling
		// 	setState({});
		this.state = {
			inputPhrase: "",
			inputChar: ""
		};

		//add the target phrases here or load them from external files
		this.targetPhrase =  "target phrase one";


		// For Debug, uncomment only if you want to measure exact width and height in pixels.
		// Following codes won't be affected on any of your code. 
		/*
		var size42 = deviceIndependenceSize(112,42);
		console.log("AppleWatch 42mm => "+size42.width +"/"+size42.height);
		var size38 = deviceIndependenceSize(112,38);
		console.log("AppleWatch 38mm => "+size38.width +"/"+size38.height);
		*/
	}

	/**
	 * Callback for input character changes.
	 * @param {} c: changed character
	 *
	 * This callback will be passed to child (Keyboard components, in our case).
	 * when the input character received, it changes inputPhrase state.
	 */
	onKeyCharReceived = (c) => {
		this.setState({inputChar : c});
		this.state.inputPhrase += c;
	};


	//log data to files
	//this sample code only logs the target phrase and the user's input phrases
	//TODO: you need to log other measurements, such as the time when a user inputs each char, user id, etc.
	saveData = () => {
		let log_file = JSON.stringify({
			targetPhrase: this.targetPhrase,
			inputPhrase: this.state.inputPhrase
		})
		download(log_file, "results.txt", "text/plain");
	}


	/**
	 * Render function()
	 * This function will return UI of the system.
	 *	It will return different text-entry system, depending on which
	 *	type property you did pass from index.js
	 */
	render(){
		// style={{}} is an inline styling with calculated screen size
		if(this.type === 'normal'){
			return(
				<div className="watch">
					 <label>{this.targetPhrase}</label>
					<TextArea inputChar={this.state.inputChar}/>
					<KeyboardNormal originalScale={this.originalScale} onKeyCharReceived ={this.onKeyCharReceived}/>
					<button onClick={this.saveData}>SAVE</button>
				</div>
			);
		}else if(this.type === 'zoom'){
			//the save button below is only to demonstrate to you how to save data
			// to files.
			//TODO: You need to remove it in your experiment and figure out another way
			// call this.saveData function to save user's data
			return(
				<div className="watch">
				  <label>{this.targetPhrase}</label>
					<TextArea inputChar={this.state.inputChar}/>
					<KeyboardZoom originalScale={this.originalScale} onKeyCharReceived ={this.onKeyCharReceived}/>
					<button onClick={this.saveData}>SAVE</button>
				</div>
			);
		}else{
			// exception
			return(
				<div>
					<p> [Rendering Failed] You have got wrong parameters. Check your 'type' property </p>
				</div>
			)
		}
	}
}

export default Watch
