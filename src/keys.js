/***************************************************
* CSC428/2514 - St. George, Fall 2018 
* 
* File: keys.js
* Summary: This js file contains keycharacter information on keyboard image. 
* 	raw_keys and raw_keys_sym objects have information of each keys in keymaps.
//	We provide two different type of keymaps.
//	raw_keys object has information of alphabet character keys
//	raw_keys_sym object has information of nubmer and symbol character keys.
// 	Each values in the object has following structure
//	x: left-most in pixel coordinate
//	y: top-most in pixel coordinate
//	width: width of assigned key in keyboard image
//	height: height of assigned key in keyboard image
//
//	Details are provided in README
* 
* The code is commented, and the comments provide information
* about what each js file is doing.
*
* Written by: Seyong Ha, Mingming Fan, Sep. 2018
*				Assignment2: Quantitative Analysis
*				Updated at: NA
****************************************************/

var raw_keys = [
42,143,93,93,"q",
135,143,93,93,"w",
228,143,93,93,"e",
321,143,93,93,"r",
414,143,93,93,"t",
507,143,93,93,"y",
600,143,93,93,"u",
693,143,93,93,"i",
786,143,93,93,"o",
879,143,93,93,"p",
42,236,132,86,"a",
174,236,92,86,"s",
266,236,92,86,"d",
358,236,92,86,"f",
450,236,92,86,"g",
542,236,92,86,"h",
634,236,92,86,"j",
726,236,92,86,"k",
818,236,132,86,"l",
93,322,132,86,"z",
224,322,91,86,"x",
315,322,91,86,"c",
406,322,91,86,"v",
497,322,90,86,"b",
587,322,90,86,"n",
677,322,90,86,"m",
767,322,90,86,",",
857,322,90,86,".",
267,408,545,90," "
];

var raw_keys_sym = [
42,38,93,105,"1", 
135,38,93,105,"2", 
228,38,93,105,"3", 
321,38,93,105,"4", 
414,38,93,105,"5", 
507,38,93,105,"6", 
600,38,93,105,"7", 
693,38,93,105,"8", 
786,38,93,105,"9", 
879,38,93,105,"0", 
42,143,93,93,"!", 
135,143,93,93,"@", 
228,143,93,93,"#", 
321,143,93,93,"$", 
414,143,93,93,"%", 
507,143,93,93,"^", 
600,143,93,93,"&", 
693,143,93,93,"*", 
786,143,93,93,"(", 
879,143,93,93,")", 
42,236,132,86,"`", 
174,236,92,86,"~", 
266,236,92,86,"<", 
358,236,92,86,">", 
450,236,92,86,"{", 
542,236,92,86,"}", 
634,236,92,86,"[", 
726,236,92,86,"]", 
818,236,132,86,"\\", 
93,322,132,86,"'", 
224,322,91,86,'"', 
315,322,91,86,":", 
406,322,91,86,";", 
497,322,90,86,"=", 
587,322,90,86,"-", 
677,322,90,86,"+", 
767,322,90,86,"?", 
857,322,90,86,"/", 
267,408,545,90," "
];

const keys = [];
for(var i = 0; i<raw_keys.length; i+=5) {
	var key_info = {
		x : raw_keys[i]
		, y : raw_keys[i+1]
		, width : raw_keys[i+2]
		, height : raw_keys[i+3]
		, key : raw_keys[i+4]
	};
	keys.push(key_info);
}
window.keys = keys;

const keys_sym = [];
for(var i = 0; i<raw_keys_sym.length; i+=5) {
	var key_info = {
		x : raw_keys_sym[i]
		, y : raw_keys_sym[i+1]
		, width : raw_keys_sym[i+2]
		, height : raw_keys_sym[i+3]
		, key : raw_keys_sym[i+4]
	};
	keys_sym.push(key_info);
}
window.keys_sym = keys_sym;


const Keymaps = {keys: keys, keys_sym: keys_sym};
// We export two keymaps as one object, called Keymaps,
// you will import Keymaps object in other files.
// To access each keyboard, use 'Keymaps.keys' or 'Keymaps.keys_sym'
export default Keymaps;
