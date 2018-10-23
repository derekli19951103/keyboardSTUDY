/***************************************************
* CSC428/2514 - St. George, Fall 2018 
* 
* File: keyboard.wip.js
* Summary: This component will display the Zoomable keyboard.
*	This keyboard will be zoomed as users touch/click. 
*	Users can zoom twice. If users reached secone-level zoom by tapping twice, 
*	they can select the key they want to input.
*	React do not recommend Inherit officially, for the convenience, we apply inheritance
*	in this code. 
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
//import Keymaps from './keys.js'
import KeyboardNormal from './keyboard.normal.js'

/**
 * Zoomable Keyboard class extending KeyboardNormal
 */
class KeyboardZoom extends KeyboardNormal {

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
		// add more keyboard configuration.
		console.log(this.props.originalScale);
		this.config.zoomFactor = 2.2;
		this.config.originalScale = this.props.originalScale;
		this.config.maxZoom = 1.0;
		this.config.resetOnMaxZoom =  true;
		this.config.centerBias = 0.05
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
		if(this.inStartingPosition && e.nativeEvent.touches.length === 1){
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
		console.log("touchmove");
		if(this.isMoving === true){
			var x = e.nativeEvent.touches[0].pageX;
			var y = e.nativeEvent.touches[0].pageY;
			var dx = this.startX - x; 
			var dy = this.startY - y;
			console.log("DX: "+dx+"/"+dy);
			if(Math.abs(dx) >= this.config.minSwipeX){
				if(dx > 0){
					this.onSwipe("left");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
					console.log("swipeleft");
				}else{
					this.onSwipe("right");
					console.log("swiperight");
					this.justGestured = true;
					this.isMoving = false;
					this.startX = this.startY = null;
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
		console.log("TouchEND");
		if(this.justGestured === true){
			this.justGestured = false;
			e.preventDefault()
			e.stopPropagation();
			return;
		}else{
			e.preventDefault()
			e.stopPropagation();
			this.onFingerTouch(e);
		}
	}

	/**
	 * PointerUp Event Handler, Use only for Debugging on laptop.
	 * @param {*} e 
	 *  We are using offsetX and offsetY. The origin of offsetX and offsetY is left,top of 'container' <div>
	 */
	onPointerUp(e){
		console.log(e.nativeEvent.pointerType);
		if(e.nativeEvent.pointerType === "touch"){
			//Do nothing
			return false;
		}
		e.stopPropagation();
		console.log("[PointerUp] xy - "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
		this.onKeyClick(e);
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
		console.log("[MouseDown] xy - "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
		this.onKeyClick(e);
		e.preventDefault();
		e.stopPropagation();
		return false;
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
			// You have two keyboard layout. Alphabet and Symbols.
			var imgPath = (this.state.keyboardImg === this.imgs[0])? this.imgs[1] : this.imgs[0];
			this.setState({
				keyboardImg:imgPath 
			})
		}
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
			height: size.height,
		};
		const overlayStyle = {
			width: size.width,
			height: size.height,
			opacity: this.state.overlayStyle.opacity,
			color: this.state.overlayStyle.color,
			fontSize: (size.height/1.2)+"px"
		};
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
						style={this.state.imgStyle}/>
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
						onMouseDown = {this.onMouseDown}
						onTouchStart={this.onTouchStart}
						onTouchMove={this._onTouchMove}
						onTouchEnd={this._onTouchEnd}>
					<img id="keyboardtype" className="KB" alt="kb"
						src={this.state.keyboardImg} onLoad={this.onLoad}
						style={this.state.imgStyle}/>
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
	 * KeyClick Event Handler on the keyboard image.
	 *  Zoom level and and center of zoomed image are computed here.
	 *  More details in doZoom function();
	 * @param e: Touch / Pointer Event 
	 */
	onKeyClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.config.zoomFactor;
		var centerBias = this.config.centerBias;
		var maxZoom = this.config.maxZoom;

		this.clearResetTimeout();
		//console.log("viewport in wip: "+this.viewport.width + ":"+this.viewport.height);
		var x = e.nativeEvent.offsetX / currentZoomX + this.viewport.x;
		var y = e.nativeEvent.offsetY / currentZoomY + this.viewport.y;
		//	console.log("WIP[Click before doZoom] eventOffset => "+e.nativeEvent.offsetX + "/"+e.nativeEvent.offsetY);
		//	console.log("WIP[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
			console.log("WIP[Click before doZoom] xy => "+x + "/"+y);
		this.doZoom(x,y,scaleFactor,currentZoomVal,maxZoom,centerBias);
		this.resetTimeoutFunc();
		return false;
	}


	/**
	 * For Touch Event
	 */
	onFingerTouch(e){
		console.log("OnFingerTouch");
		//e.preventDefault();
		//e.stopPropagation();
		var currentZoomX = this.getXZoom();
		var currentZoomY = this.getYZoom();
		var currentZoomVal = this.getZoom();

		var scaleFactor = this.config.zoomFactor;
		var centerBias = this.config.centerBias;
		var maxZoom = this.config.maxZoom;

		this.clearResetTimeout();

		const touch = e.nativeEvent.changedTouches[0];//e.nativeEvent.changedTouches[0];
		// console.log("touch start x: " + touch.clientX + "; y: " + touch.clientY);
		this.clearResetTimeout();
		//Assuming mouse
		if(this.config.isTouchEnabled){

		}else{
			//pageX includes scroll offset Value
			// console.log("[offset] - "+this.offsetLeft + "/" + this.offsetTop);
			var x =  (touch.pageX - this.offsetLeft) / currentZoomX + this.viewport.x;
			var y =  (touch.pageY - this.offsetTop) / currentZoomY + this.viewport.y;
			//console.log("[Click before doZoom] touchXY => "+touch.clientX + "/"+touch.clientY);
			// console.log("[Click before doZoom] curZoom and Viewport => "+ currentZoomX + "/" + currentZoomY + "/"+ this.viewport.x + "/"+this.viewport.y);
			console.log("[Click before doZoom] xy => "+x + "/"+y);
			this.doZoom(x,y,scaleFactor,currentZoomVal,maxZoom,centerBias);
			this.resetTimeoutFunc();
		}
		//e.stopPropagation();
		return false;
	}

	resetTimeoutFunc =  () => {
		this.clearResetTimeout();
		var resetTimeout = this.config.resetTimeout;
		this.resetTimeout = window.setTimeout(this.reset,resetTimeout);
	}

	/**
	 * Zoom Function for Pointer/Mouse Event
	 * @param x: x value of input point
	 * @param y: y value of input point
	 * @param scaleFactor: constant, how deep your keyboard will be zoomed.
	 * @param currentZoomVal: currenet zoom level
	 * @param maxZoom: if a zoom value exceeded maxZoom, users has to select the key
	 * @param centerBias:
	 * 
	 */
	doZoom = (x,y,scaleFactor,currentZoomVal,maxZoom,centerBias) => {
		//var zoomtouch_event = jQuery.Event("zb_zoom")
		//zoomtouch_event.x = x;, zoomtouch_event.y = y;
		//this.element.trigger(zoomtouch_event);

		 console.log("[Debug] scaleFactor/ CurrnetZoomVal / maxZoom -> " + scaleFactor + "/ "+currentZoomVal +"/ "+maxZoom);
		if(scaleFactor * currentZoomVal > maxZoom){
			//console.log("Exceeded maxZoom ");
			var key = this.getKeyChar({x:x,y:y});

			if(key !== null){
				//this.element.trigger(zoomkey_event);
				//this.flashkey(zoomkey_event.key);
				console.log("[doZoom] Key is not null");
				this.props.onKeyCharReceived(key);
				this.flashKey(key);
			}
			this.reset();
			return;
		}else{
			this.inStartingPosition = false;
			var newViewportWidth = this.viewport.width / scaleFactor ;
			var newViewportHeight = this.viewport.height / scaleFactor;

			var centeredX = x - newViewportWidth/2;
			var centeredY = y - newViewportHeight/2;

			var biasedViewportX = x - (newViewportWidth * (x - this.viewport.x))/
										this.viewport.width;
			var biasedViewportY = y- (newViewportHeight * (y - this.viewport.y))/
										this.viewport.height;
			//console.log("doZoom in wip: "+this.viewport.width + ":"+this.viewport.height);
			//console.log("doZoom in wip: "+this.viewport.x + ":"+this.viewport.y);
			//console.log("doZoom in wip: "+scaleFactor);
			//console.log("doZoom in wip: "+newViewportWidth+ ":"+newViewportHeight);
			//console.log("doZoom in wip: "+centeredX + ":" + centeredY);
			this.setViewPort({
				width: newViewportWidth,
				height: newViewportHeight,
				x: biasedViewportX * (1-centerBias) + centeredX * centerBias,
				y: biasedViewportY * (1-centerBias) + centeredY * centerBias,
			});
		}
	}

	getXZoom = () =>{
		return this.position.width / this.state.originalDimensions.width;
	}
	getYZoom = () =>{
		return this.position.height / this.state.originalDimensions.height;
	}
	getZoom = () => {
		return Math.max(this.getXZoom(), this.getYZoom());
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
		setTimeout(
			function() {
				this.setState({
				overlayStyle:{
					opacity: 0}})
			}
			.bind(this),
			duration
		);
	}

	flashKey = (key) => {
		if(key === "delete") {
			//this.flash("&#9224;");
			this.flash("&#x232B");
		} else if(key === "enter") {
			this.flash("&#9252;");
		} else if(key === " ") {
			this.flash("&#9251;");
		} else {
			this.flash(key);
		}
	}
}

export default KeyboardZoom;
