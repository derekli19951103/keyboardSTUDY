/***************************************************
* CSC428/2514 - St. George, Fall 2018
*
* File: keyboard.normal.js
* Summary: This component will display the Baseline keyboard.
*	The baseline keyboard is just shrink its size to your watch size.
*	This component renders width:1024 x height:548 keyboard image
*	 on <img> tag with converted size.
*	'originalScale' you tossed from Watch component will be used here
*	to convert 1024x548 size into a smaller size.
*	Keyboard component will render following tags:
*		<div> container: A container, eventhandlers will be registered here.
*			<img> KB: An image displayed your keyboard layout.
*			<div> overlay: an input key will be displayed shortly here.
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
import ReactDOM from 'react-dom';
import Keymaps from './keys.js';

/**
 * KeyboardNormal class extending React Component
 */
class KeyboardNormal extends React.Component {

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
		/**
		 * This components more state values.
		 * - originalScale: a scale value to resize a keyboard image.
		 * - swiped: A flag for swipe event.
		 * - imgStyle: CSS style for the keyboard image.
		 * - overlayStyle: CSS style for the overlay <div>
		 * - keyboardImg: A keyboard image to be displayed.
		 * - overlayText: a text for overlay <div>
		 * - originalDimensions: containing a dimension of chosen keyboard image.
		 */
		this.state ={
        	originalScale: this.props.originalScale,
			swiped: false,
			imgStyle : {
				left:0, top:0,
				width: this.props.width,
				height: this.props.height
			},
			overlayStyle : {
				opacity: 0,
				color: "white"
			},
			keyboardImg : "/images/ZoomBoard3b.png",
			overlayText : "",
			originalDimensions : {width:0, height:0}
		};

		// Following variables are necessary for rendering, but since they do not
		// 	directly affect the rendering process, we are not going to set them as React States
		//	React State affects UI rendering directly, which means , everytime your react state has changed
		// 	by caling setState({}), render() function will be called.
		this.inStartingPosition = true;
		this.imgs = ["/images/ZoomBoard3b.png","/images/symbols3b.png"];
        this.originalPosition =  {x:0,y:0};
		this.originalDimensions = {width:0, height:0};
		this.displaySize = this.props.displaySize;
		this._swipe = {};
		this.startX = 0.0;
		this.startY = 0.0;

		// Keyboard configuration settings
		this.config = {
			resetTimeout: 1000,
			animTime: 0.1,
			useRealKeyboard: true,
			maxKeyErrorDistance: 2,
			// You can manipulate following two values to control swipe gesture threshold.
			minSwipeX: 40,
			minSwipeY: 1,
			originalScale: this.props.originalScale
		}

		// register EventListener
		this.onLoad = this.onLoad.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);

		// Check if PointerEvent is supported.
		// PointerEvent is recommended for Chrome (> v55), Edge.
		// Mouse&TouchEvent are recommended for other browsers.
		if(window.PointerEvent){
			this.onPointerUp = this.onPointerUp.bind(this);
			this.onTouchStart = this.onTouchStart.bind(this);
			this._onTouchMove = this._onTouchMove.bind(this);
			this._onTouchEnd = this._onTouchEnd.bind(this);
		}else{
			this.onTouchStart = this.onTouchStart.bind(this);
			this.onMouseDown = this.onMouseDown.bind(this);
			this._onTouchMove = this._onTouchMove.bind(this);
			this._onTouchEnd = this._onTouchEnd.bind(this);
		}
	}


	/**
	 * Touch Event handlers
	 * @param {*} e : to access javascript touchevent,
	 * 					you should access as 'e.nativeEvent'
	 */
	onTouchStart(e) {
		console.log("touchstart");
		this.isMoving = false;
		//const touch = e.nativeEvent.touches[0];
		if(this.inStartingPosition && e.nativeEvent.touches.length ===1){
			this.startX = e.nativeEvent.touches[0].pageX;
			this.startY = e.nativeEvent.touches[0].pageY;
			this.isMoving = true;
		}
	}

	/**
	 * Touch Event Handler
	 * @param {*} e : touch event object.
	 */
	_onTouchMove(e) {
		console.log('touchmove');
		if(this.isMoving === true){
		console.log("move");
			var x = e.nativeEvent.touches[0].pageX;
			var y = e.nativeEvent.touches[0].pageY;
			var dx = this.startX - x; 
			var dy = this.startY - y;
			console.log("DX: "+dx+"/"+dy);
			if((Math.abs(dx) > Math.abs(dy)) &&
				Math.abs(dx) >= this.config.minSwipeX){
				if(dx > 0){
					this.onSwipe("left");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
					console.log("swipeleft");
				}else{
					this.onSwipe("right");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
					console.log("swiperight");
				}
			}else if(Math.abs(dy) >= this.config.minSwipeY){
				if(dy > 0){
					this.onSwipe("up");
					console.log("swipeup");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
				}else{
					this.onSwipe("down");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
				}
			}
		}
	}

	/**
	 * TouchEvent Handler
	 * @param {} e : touch event object.
	 */
	_onTouchEnd(e) {
		console.log('touchend');
		if(this.justGestured === true){
			this.justGestured = false;
			e.nativeEvent.preventDefault();
			e.nativeEvent.stopPropagation();
			return;
		}else{
			const touch = e.nativeEvent.changedTouches[0];
			var x = (touch.clientX - this.offsetLeft) / (this.position.width/this.state.originalDimensions.width);
			var y = (touch.clientY - this.offsetTop) / (this.position.height/this.state.originalDimensions.height);
			e.nativeEvent.preventDefault();
			e.nativeEvent.stopPropagation();
			this.onKeyClick({x:x,y:y});
		}
	}

	/**
	 * SwipeEvent Handler, manually called from the code.
	 * 	Currently, we are using only 'left' and 'up' directions.
	 * @param: direction, swiping direction.
	 */
	onSwipe = (direction) => {
		if(direction === "left"){ // Delete character.
			var key = "delete";
			this.props.onKeyCharReceived(key);
		}else if(direction === "up"){ // Change keyboard layout from one to another.
			// You have two keyboard layouts: Alphabet and Symbols.
			var imgPath = (this.state.keyboardImg === this.imgs[0])? this.imgs[1] : this.imgs[0];
			this.setState({
				keyboardImg:imgPath
			})
		} else if(direction === "right"){
			//do something here if you wish to use the swipt to the right gesture
		}
		else if(direction === "down"){
			//do something here if you wish to use the swipt to the right gesture
		}
	}

	/**
	 * Image Load Event Handler
	 * 	This callback is called when image has loaded.
	 * @param {*} param: an object containing information of loaded image.
	 */
	onLoad({target:img}){
		//console.log("[onLoad] image naturalSize: "+img.naturalWidth+":"+img.naturalHeight);

		/*
		this.originalDimensions = {
			width:img.naturalWidth,
			height:img.naturalHeight
		};*/

		// Changing React state is asynchronous,
		// 	to sync the change of the state and function call, pass the function as a parameter.
		this.setState({
			originalDimensions:{
				width:img.naturalWidth,
				height:img.naturalHeight
			}
		},this.reset);

		//
		if(this.displaySize !== undefined){
			this.config.originalScale = this.displaySize.width/this.originalDimensions.width;
			/*
			this.setState({
				originalScale:this.displaySize.width/this.original_dimensions.width
			});*/
		}
	}

	/**
	 * KeyDown Event Handler,
	 * 	For input test. You can use your physical keyboard on your labtop.
	 * @param ev: keyboard event object.
	 */
	onKeyDown = (ev) => {
		//console.log("Key pressed: " + ev.key + "/" +ev.keyCode);
		if(ev.keyCode === 37){
		//	console.log("[KeyPressed] Left arrow clicked");
		}else if(ev.keyCode === 38){
		//	console.log("[KeyPressed] Top arrow clicked");
		}else if(ev.keyCode === 39){
		//	console.log("[KeyPressed] Right arrow clicked");
		}else if(ev.keyCode === 40){
		//	console.log("[KeyPressed] Down arrow clicked");
		}else{
			var key = String.fromCharCode(ev.keyCode).toLocaleLowerCase();
			if(ev.keyCode === 8){
				ev.returnValue = false;
				ev.cancleBubble = true;
				key = "delete";
			}else if(ev.keyCode === 13){
				key = "Enter";
			}
			// process Callback function from parent Component,
			// this will change inputChar and inputPhrase in Watch component.
			this.props.onKeyCharReceived(key);

			// Flashing a selected key on overlay <div>
			this.flashKey(key);
			ev.nativeEvent.preventDefault();
			ev.nativeEvent.stopPropagation();
			return false;
		}
	}

	/**
	 * PointerUp Event Handler, use Only for Debugging on laptop
	 * @param {*} e
	 *  We are using offsetX and offsetY. The origin of offsetX and offsetY is left,top of 'container' <div>
	 */
	onPointerUp(e){
		// use e.nativeEvent.offsetX,Y for accuracy
		if(e.nativeEvent.pointerType === "touch"){
			//Do nothing
			return false;
		}
		//var x = e.nativeEvent.offsetX / (this.position.width/this.originalDimensions.width);
		//var y = e.nativeEvent.offsetY / (this.position.height/this.originalDimensions.height);
		var x = e.nativeEvent.offsetX / (this.position.width/this.state.originalDimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.state.originalDimensions.height);
		console.log("[onPointerUp] xy: "+ x + ":" + y);
		this.onKeyClick({x:x,y:y});
		//e.preventDefault();
		//e.stopPropagation();
		return false;
	}

	/**
	 * MouseDown Event Handler,
	 *  same as PointerUp. This is implemented to test with your mouse on devtools of your browser.
	 * @param {*} e
	 */
	onMouseDown(e) {
		// use e.nativeEvent.offsetX,Y for accuracy
		//var x = e.nativeEvent.offsetX / (this.position.width/this.originalDimensions.width);
		//var y = e.nativeEvent.offsetY / (this.position.height/this.originalDimensions.height);
		var x = e.nativeEvent.offsetX / (this.position.width/this.state.originalDimensions.width);
		var y = e.nativeEvent.offsetY / (this.position.height/this.state.originalDimensions.height);
		console.log("[onMouseDown] xy: "+ x + ":" + y);
		console.log("[onMouseDown] position: "+ this.position.x + ":" + this.position.y);
		this.onKeyClick({x:x,y:y});
		e.preventDefault();
		e.stopPropagation();
	}

	/**
	 * Callback in React Componenet lifecycle.
	 * once all the component value has changed, this function is called.
	 */
	componentDidUpdate = () => {
		// For touch event, we cannot use offsetX and offsetY
		// 	to calculate the touched point on the keyboard image,
		//  we stored the 'container' <div>'s left and top values on screen.
		this.offsetTop = ReactDOM.findDOMNode(this).offsetTop;
		this.offsetLeft = ReactDOM.findDOMNode(this).offsetLeft;
	}

	/**
	 * Render function
	 */
	render(){
		const size = this.getWindowDimension();
		const style = {
			width: size.width,
			height: size.height
		};
		const overlayStyle = {
			width: size.width,
			height: size.height,
			opacity: this.state.overlayStyle.opacity,
			color: this.state.overlayStyle.color,
			fontSize:(size.height/1.2)+"px"
		};
		//const fontHeight = {
		//	fontSize : size.height/1.2
		//}
		const imgStyle = {
			width:size.width,
			height:size.height,
			top: this.state.top,
			left: this.state.left
		}
		console.log("[Rendering...] " + size.width +"/"+size.height);
		// if your browser supports PointerEvent...
		if(window.PointerEvent){
			return(
				<div className="container" style = {style} tabIndex="-1"
						onKeyDown={this.onKeyDown}
						onTouchStart={this.onTouchStart}
						onTouchMove={this._onTouchMove}
						onTouchEnd={this._onTouchEnd}
						onPointerUp = {this.onPointerUp}>
					<img id="keyboardtype" className="KB" alt="kb"
						src={this.state.keyboardImg} onLoad={this.onLoad}
						style={imgStyle}/>
					<div className="overlay"
						style={overlayStyle}
						dangerouslySetInnerHTML={{
							__html: this.state.overlayText
						}}></div>
				</div>
			)
		}else{ //else
			return(
				<div className="container" style = {style} tabIndex="-1"
						onKeyDown={this.onKeyDown}
						onTouchStart={this.onTouchStart}
						onTouchMove={this._onTouchMove}
						onTouchEnd={this._onTouchEnd}>
					<img id="keyboardtype" className="KB" alt="kb"
						src={this.state.keyboardImg} onLoad={this.onLoad}
						style={imgStyle}/>
					<div className="overlay"
						style={overlayStyle}
						dangerouslySetInnerHTML={{
							__html: this.state.overlayText
						}}></div>
				</div>
			)
		}
	}

	/**
	 * Reset function.
	 * This function will reset a viewport to initial setup.
	 * @param animated: a flag for transition animation.
	 */
	reset = (animated) => {
		//console.log("call reset...");
		this.setViewPort({
			x:0 , y:0,
			//width: this.originalDimensions.width,
			//height:this.originalDimensions.height
			width: this.state.originalDimensions.width,
			height:this.state.originalDimensions.height
			},animated === true);
		this.clearResetTimeout();
		this.inStartingPosition = true;
	}

	/**
	 * setViewport function
	 * @param viewport: a viewport to be set
	 * 				viewport paramters has x, y, width, and height.
	 * @param animated: a flag for transition animation.
	 */
	setViewPort = (viewport,animated) =>{
		// Get initial window dimension
		var windowDim = this.getWindowDimension();
		// Calculate the scale value of X, Y
		var scaleX = windowDim.width/viewport.width;
		var scaleY = windowDim.height/viewport.height;
		//var width = scaleX * this.originalDimensions.width;
		//var height = scaleY * this.originalDimensions.height;
		// get width and height with scale values computed above.
		var width = scaleX * this.state.originalDimensions.width;
		var height = scaleY * this.state.originalDimensions.height;
		// this x,y values will shift your image
		var x = -1 * viewport.x * scaleX;
		var y = -1 * viewport.y * scaleY;

		// reposition your keyboard image within 'container' <div>
		this.setPosition({x:x,y:y,width:width,height:height},animated);
		this.viewport = viewport;
	}

	clearResetTimeout = () => {
		if(this.resetTimeout !== undefined){
			window.clearTimeout(this.resetTimeout);
		}
		this.resetTimeout = undefined;
	}

	/**
	 * KeyClick event on the keyboard image.
	 */
	onKeyClick = (pt) => {

		console.log("[onKeyClick] ..."+pt.x);
		var key = this.getKeyChar(pt);

		if(key != null){
			console.log("[onKeyClick] "+key+" typed.");
			this.props.onKeyCharReceived(key);
			this.flashKey(key);
		}
		return false;
	}

	/**
	 * Get WindowDimension
	 * 	compute the windowdimension with your originalScale value.
	 * 	This will return initial keyboard image size and your watch size.
	 */
	getWindowDimension = () => {
		//console.log("Scale: "+this.config.originalScale)
		return {
			//width: this.originalDimensions.width * this.config.originalScale,
			//height: this.originalDimensions.height * this.config.originalScale
			width: this.state.originalDimensions.width * this.config.originalScale,
			height: this.state.originalDimensions.height * this.config.originalScale
		};
	}

	/**
	 * Compute KeyChar on the keyboard iamge.
	 * @param pt: x,y value on the keyboard image.
	 */
	getKeyChar = (pt) => {
		console.log("Get KeyChar");
		var minDistance = false, minDistanceKey = null;
		var maxKeyErrorDistSquared = Math.pow(this.config.maxKeyErrorDistance,2);

		//Select which keyboard layout is currently displayed.
		var keys = (this.state.keyboardImg === this.imgs[0])? Keymaps.keys : Keymaps.keys_sym;

		//Iterate through keymaps.
		for(var i=0, len = keys.length; i<len; i++){
			var keychar = keys[i];
			console.log("[keychar]: "+keychar);
			//console.log("Point XY: "+pt.x+"/"+pt.y);
			if(keychar.x <= pt.x && keychar.y <= pt.y && keychar.x + keychar.width >= pt.x && keychar.y + keychar.height >= pt.y)
			{
				//if point is within particular key.
				return keychar.key;
			}else{ // approximate the selected key.
				var keyCharCenterX = keychar.x + keychar.width/2;
				var keyCharCenterY = keychar.y + keychar.height/2;
				var dx = pt.x - keyCharCenterX;
				var dy = pt.y - keyCharCenterY;
				var dSquared = Math.pow(dx,2) + Math.pow(dy,2);
				if((minDistanceKey === null || dSquared < minDistance) &&
					 dSquared < maxKeyErrorDistSquared * Math.pow(Math.min(keychar.width, keychar.height), 2))
				{
					minDistance = dSquared;
					minDistanceKey = keychar.key;
				}
			}
		}
		return minDistanceKey;
	}

	/**
	 * Reposition the keyboard image in <img> tag,
	 * @param position: x,y values should be negative values.
	 * 				width and height are newly computed the size of keyboard image
	 */
	setPosition = (position,animated) => {
		console.log("Entering setPosition() ..."+position.width);
		if(animated === false){
			//img.css -webkit-transition none
			//img.css -webkit-transition all 0.001s ease-out
		}
		this.setState({
			imgStyle:{
				left:position.x,
				top:position.y,
				width:position.width,
				height:position.height
			}
		})
		this.position = position;
	}

	flashKey = (key) => {
		if(key === "delete") {
			this.flash("&#x232B");
		} else if(key === "enter") {
			this.flash("&#9252;");
		} else if(key === " ") {
			this.flash("&#9251;");
		} else {
			this.flash(key);
		}
	}
	flash = (text, duration, color) => {
		duration = duration || 250;
		color = color || "white";
		//window.clearTimeout(this.flashTimeout);
		this.setState({
			overlayStyle:{
				opacity: 0.95,
				color: color
			},
			overlayText: text
		});
		this.flashTimeout = setTimeout(
			(() => {
				this.setState({
				overlayStyle:{
					opacity: 0}})
			})
			,duration
		);
	}
}

export default KeyboardNormal;
