/***************************************************
* CSC428/2514 - St. George, Fall 2018 
* 
* File: textarea.js
* Summary: Textfield which displays input characters by users.
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
import React from 'react'

class TextArea extends React.Component{
    /**
     * Constructor
     *  * @param {} props: a paramater which enables you to access
	 * 			values passed from parent Componenet(or Node).
	 * 			e.g., if you pass 'value' as 5 in Watch component
	 * 				<Watch value={5}/>
	 * 				you can access by calling 'this.props.value'
	 * 				props are immutable.
     */
    constructor(props){
        super(props);
        // React State
        // this component will display text, once this.state.text value has changed,
        // TextArea component will re-render. *** text value has to be changed by 
        // 'setState({text: VALUE})'
        this.state = {
            text: ""
        }
    }

    /**
     * Function in React Component lifecycle.
     * When the parent component pass different properties, 
     * This function will be called.
     */
    componentWillReceiveProps= (nextProps) => {
        var c = nextProps.inputChar;
        var displayText = this.state.text;

        // if the input character is 'delete', 
        //  delete the last sentence from the displayed text.
        if(nextProps.inputChar === "delete") {
            displayText = displayText.substring(0,displayText.length-1);
            this.setState({text: displayText})
        } else {
            displayText = displayText.concat(c);
            this.setState({text: displayText})
        }
    }

    /**
     * Render function.
     * This one returns <div></div> with classname "type".
     * You can do inline styling by pass css values to 'style' property.
     * You can do either
     *  style={YOUR STYLE} or
     *  style={{CSS_PROP: YOUR_VALUE, CSS_PROP: YOURVALUE,..}} 
     */
    render(){
        return(
            <div className="typed" style = {this.props.style}>
                {this.state.text}
            </div>
        )
    }
}

export default TextArea;
