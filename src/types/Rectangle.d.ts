/* General representation for rectangles in the 
   application x and y are the given coordinates 
   of the top-left corner of the rectangle, while 
   width and height is the respective dimensions of 
   it from the (x,y) position.
*/

declare interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}