/* ----- Bezier Helper v1.1.0 ## Zavier Boyles 2024 ----- */
// This tool requires p5.js to draw shapes and access the DOM

/* 
*   SETUP INSTRUCTIONS
*
*   Put this file in the 'libraries' folder of your project
*
*   In 'index.html', add this code below the script for the parametric wallpaper (line 11): 
*           <script src="./libraries/bezierHelper.js"></script>
*
*   In 'my_wallpaper.js', add this code in the setup_wallpaper function:
*           BezierHelper.useBezierTool(pWallpaper);
*
*   In 'my_wallpaper.js', add this code at the start of the my_symbol function:
*           BezierHelper.storeTransform();
*/

const BezierHelper = (function () {

    // Private variable
    let p; // p5 instance
    let pW;
    let mainCanvas, bezCanvas;
    let transformMat, windowDim;
    let bezierSpline;

    let usingTool = true;
    let transformStored = false;

    // DOM elements in settings box
    let hiddenElement,
        title,
        hideCheck,
        addCurveButton,
        addCurvePrompt,
        saveCurveButton,
        loadLastButton,
        copyButton;

    function useBezierTool(pWallpaper) {
        // Only activate the tool if in DEVELOP_GLYPH mode
        if (pWallpaper._output_function == window.DEVELOP_GLYPH) {
            pW = pWallpaper;
            mainCanvas = drawingContext.canvas;

            setupNewHelper();
        }
    }

    function storeTransform() {
        if (pW == undefined) return;
        transformMat = drawingContext.getTransform().invertSelf();
        windowDim = {width: p.width, height: p.height};
        transformStored = true;
    }

    function setupNewHelper() {
        mainCanvas = drawingContext.canvas;

        p = new p5(bezierSketch);

        bezCanvas.style('transition', 'opacity 0.1s ease');

        createSettingsBox();
    }

    function createSettingsBox() {
        textFont('Verdana');

        // Create a div element
        hiddenElement = createDiv();
        hiddenElement.position(20, 20);
        hiddenElement.size(150, 200);
        hiddenElement.style('background-color', '#d6d6d6');
        hiddenElement.style('padding', '15px');
        hiddenElement.style('border-radius', '5px');
        hiddenElement.style('opacity', '0');
        hiddenElement.style('transition', 'opacity 0.3s ease');

        // Set mouse events
        hiddenElement.mouseOver(() => hiddenElement.style('opacity', '1'));
        hiddenElement.mouseOut(() => hiddenElement.style('opacity', '0'));

        title = createDiv('Bezier Tool Settings');
        title.parent(hiddenElement);
        title.style('margin-bottom', '10px');

        hideCheck = createCheckbox(' Show tool', true);
        hideCheck.parent(hiddenElement);
        hideCheck.changed(() => {
            usingTool = hideCheck.checked();
            usingTool ? bezCanvas.style('opacity', '1') : bezCanvas.style('opacity', '0');
            usingTool ? copyButton.show() : copyButton.hide();

        });
        hideCheck.style('margin-bottom', '10px');

        addCurveButton = createButton('Add Vertex');
        addCurveButton.parent(hiddenElement);
        addCurveButton.mousePressed(() => {
            addCurvePrompt = prompt("Enter Vertex", "x, y");

            let point = parseVertex(addCurvePrompt);
            if (point != null) {
                bezierSpline.addPoint(point.x, point.y);
            }
        });
        addCurveButton.style('margin-bottom', '10px');

        saveCurveButton = createButton('Save Curve');
        saveCurveButton.parent(hiddenElement);
        saveCurveButton.mousePressed(() => {
            let data = bezierSpline.controlPoints;
            storeItem('curve', data);
            print("Curve state saved.")
        });
        saveCurveButton.style('margin-bottom', '10px');

        loadLastButton = createButton('Load Last Curve');
        loadLastButton.parent(hiddenElement);
        loadLastButton.mousePressed(() => {
            let savedData = getItem('curve');
            if (savedData === null) loadData([]);
            else loadData(savedData);
            print("Saved curve loaded.")
        });
        loadLastButton.style('margin-bottom', '10px');

        copyButton = createButton('Copy Code');
        copyButton.parent(hiddenElement);
        copyButton.mousePressed(() => {
            if (bezierSpline.controlPoints.length >= 4 && bezierSpline.controlPoints.length % 3 - 1) {
                return print("Invalid curve: Must have a valid number of control points.");
            }

            let codeString = getCodeString();

            navigator.clipboard.writeText(codeString)
                .then(() => console.log('Code copied to clipboard'))
                .catch(err => console.error('Failed to copy code: ' + codeString, err));
        });
        copyButton.style('margin-bottom', '10px');
    }

    let bezierSketch = (p) => {
        p.setup = () => {
            p.angleMode(DEGREES);

            bezCanvas = p.createCanvas(mainCanvas.clientWidth, mainCanvas.clientHeight);
            bezCanvas.position(0, 0);
            bezCanvas.style('position', 'absolute');

            bezierSpline = new BezierSpline();
            bezierSpline.addPoint(200, 200);
            bezierSpline.addPoint(200, 100);
            bezierSpline.addPoint(300, 100);
            bezierSpline.addPoint(300, 200);
        };

        p.draw = () => {
            // Draw bezier
            p.clear();
            bezierSpline.draw();
        }

        p.mousePressed = () => {
            if (usingTool) bezierSpline.checkMousePressed();
        }

        p.mouseDragged = () => {
            if (usingTool) bezierSpline.checkMouseDragged();
        }

        p.mouseReleased = () => {
            if (usingTool) bezierSpline.checkMouseReleased();
        }

        p.keyPressed = () => {
            if (!usingTool) return;

            if (key == 'a' || key == 'A') {
                bezierSpline.addPoint(mouseX, mouseY);
            } else if (key == 'r' || key == 'R') {
                bezierSpline.removePoint();
            }
        }

        p.doubleClicked = () => {
            if (!usingTool) return;

            bezierSpline.checkMousePressed();

            if (bezierSpline.selectedPoint != null && bezierSpline.selectedPoint.onLine) {
                bezierSpline.selectedPoint.locked = !bezierSpline.selectedPoint.locked;
                if (bezierSpline.selectedPoint.locked) bezierSpline.alignSelectedPoint();

                bezierSpline.selectedPoint = null;
            }
        }
    }

    function parseVertex(string) {
        let s1 = string.split(",");
        if (s1.length != 2) return print("Vertex not added: Incorrect number of components: " + s1.length);
        s1[0] = parseInt(s1[0]); if (isNaN(s1[0])) {print("Vertex not added: x value is not a number"); return null};
        s1[1] = parseInt(s1[1]); if (isNaN(s1[1])) {print("Vertex not added: y value is not a number"); return null};
        
        let s2 = bezierSpline.transformPointToLocal({x: s1[0], y: s1[1]});

        return {x: s2.x, y: s2.y};
    }

    function loadData(data) {
        bezierSpline.controlPoints = data;
    }

    function getCodeString() {
        let cp = bezierSpline.transformPointsToWorld();
        
        let codeString = "" +
            "beginShape();\n" + 
            "vertex(" + cp[0].x + ", " + cp[0].y + ");\n";

        for (let i = 1; i < cp.length; i += 3) {
            codeString += "bezierVertex(" + cp[i].x + ", " + cp[i].y + ", " +
                        cp[i + 1].x + ", " + cp[i + 1].y + ", " +
                        cp[i + 2].x + ", " + cp[i + 2].y + ");\n"
        }

        codeString += "endShape();"

        return codeString;
    }

    class BezierSpline {
        constructor() {
            this.controlPoints = [];
            this.selectedPoint = null;
        }

        addPoint(x, y) {
            this.controlPoints.push(
                new ControlPoint(x, y, this.controlPoints.length % 3 == 0)
            );
        }

        removePoint() {
            if (this.controlPoints.length > 0) {
                this.controlPoints.pop();
            }
        }

        alignSelectedPoint() {
            let index = this.controlPoints.indexOf(this.selectedPoint);

        }

        transformPointsToWorld() {
            let transformed = [];
            for (let point of this.controlPoints) {
                let pt = new DOMPoint(point.x, point.y);
                pt = pt.matrixTransform(transformMat);
                transformed.push({ x: round(pt.x), y: round(pt.y) });
            }
            return transformed;
        }

        transformPointToLocal(point) {
            let invMat = transformMat;
            invMat = DOMMatrix.fromFloat32Array(invMat.inverse().toFloat32Array())

            let p = new DOMPoint(point.x, point.y);
            p = p.matrixTransform(invMat);
            return {x: p.x, y: p.y};
        }

        draw() {
            p.stroke('#d04648');
            p.strokeWeight(3);
            p.noFill();
            p.beginShape();
            for (let i = 0; i < this.controlPoints.length; i += 3) {
                if (i == 0) {
                    p.vertex(this.controlPoints[i].x, this.controlPoints[i].y);
                } else {
                    p.bezierVertex(
                        this.controlPoints[i - 2].x,
                        this.controlPoints[i - 2].y,
                        this.controlPoints[i - 1].x,
                        this.controlPoints[i - 1].y,
                        this.controlPoints[i].x,
                        this.controlPoints[i].y,
                    );
                }
            }
            p.endShape();

            // Draw arms
            p.noFill();
            p.stroke(0);
            p.strokeWeight(1.5);
            for (let i = 0; i < this.controlPoints.length; i++) {
                let point = this.controlPoints[i];
                if (point.onLine) {
                    if (i > 0) {
                        p.line(point.x, point.y, this.controlPoints[i - 1].x, this.controlPoints[i - 1].y);
                    }
                    if (i < this.controlPoints.length - 1) {
                        p.line(point.x, point.y, this.controlPoints[i + 1].x, this.controlPoints[i + 1].y);
                    }
                }
            }

            // Draw control points
            p.noStroke();
            for (let point of this.controlPoints) {
                point.onLine ? (point.locked ? p.fill(222, 53, 11) : p.fill(11, 222, 50)) : p.fill(0);
                p.circle(point.x, point.y, 12);
            }
            
        }

        checkMousePressed() {
            for (let point of this.controlPoints) {
                if (p.dist(mouseX, mouseY, point.x, point.y) < 8) {
                    this.selectedPoint = point;
                    break;
                }
            }
        }

        checkMouseDragged() {
            if (this.selectedPoint) {
                this.selectedPoint.x = mouseX;
                this.selectedPoint.y = mouseY;
            }
        }

        checkMouseReleased() {
            this.selectedPoint = null;
        }
    }

    class ControlPoint {
        constructor(x, y, onLine) {
            this.x = x;
            this.y = y;
            this.onLine = onLine;
            this.locked = false;
        }

        array() {
            return [this.x, this.y, 1];
        }
    }

    return {
        useBezierTool: useBezierTool,
        storeTransform: storeTransform
    }
})();