let appContainer, canvas;
let d_moveAllCheck, d_mirroringRadio;
let d_translationInputs = [];
let d_scalingSlider;
let d_rotationElements = [];
let d_outputPara, d_copyButton, d_resetButton;

let bez;
let selectedPoint;

let doMoveAll = false;
let isMovingBez = false;
let mirroringState = 'None';
let canvasTransform, worldTransform, worldScale, worldCanvasExtent;

function centerCanvas() {
    let x = (appContainer.width - width) / 2;
    let y = (appContainer.width - height) / 2;
    canvas.position(x, y);
}

function setup() {
    angleMode(DEGREES);

    appContainer = select('#bezierHelperContainer');
    appContainer.width = 350;

    canvas = createCanvas(200, 200);
    canvas.parent('canvas')
    // centerCanvas();

    d_moveAllCheck = createCheckbox(" ", false).parent('moveAllCheckContainer').input(changedMoveAllCheck);
    d_mirroringRadio = createRadio().parent('mirroringRadioContainer').input(changedMirroring);
    d_mirroringRadio.option('None');
    d_mirroringRadio.option('X');
    d_mirroringRadio.option('Y');
    d_mirroringRadio.selected('None');
    d_translationInputs.push(createInput('0', 'number').parent('translationInputContainer').input(changedTranslationX));
    d_translationInputs.push(createInput('0', 'number').parent('translationInputContainer').input(changedTranslationY));
    d_scalingSlider = createSlider(0, 1, 0.5, 0.01).parent('scalingSliderContainer').input(changedScaling);
    d_rotationElements[0] = createInput('0', 'number').parent('rotationElemsContainer').input(changedRotaionAmnt);
    d_rotationElements[1] = createButton('Apply').parent('rotationElemsContainer').mousePressed(applyRotation);
    d_copyButton = createButton('Copy').parent('copyButtonContainer').mousePressed(copyOutput);
    d_resetButton = createButton('Reset').parent('copyButtonContainer').mousePressed(resetBez);
    d_outputPara = createP("").parent('outputValueContainer');

    canvasTransform = createVector(0, 0);
    worldTransform = createVector(0, 0);
    worldScale = 1;
    worldCanvasExtent = width * worldScale;

    bez = new Bezier(width/2, height/2);

    updateOutput();
}

function draw() {
    background(51);

    strokeWeight(0.5);
    textSize(10);

    // X-axis
    stroke(50, 168, 50);
    (canvasTransform.y <= -height / 2 || canvasTransform.y >= height/2) ? drawingContext.setLineDash([5, 5]) : drawingContext.setLineDash([]);
    line(-width, constrain(canvasTransform.y + height / 2, 0, height), width, constrain(canvasTransform.y + height / 2, 1, height-1));
    drawingContext.setLineDash([]);

    noStroke();
    fill(50, 168, 50);
    translate(width - 12, constrain(height / 2 + canvasTransform.y + 2.5 - (canvasTransform.y <= 0 ? 0 : 5.5), 2.5, height - 3.5));
    rotate(90);
    textAlign(canvasTransform.y <= 0 ? LEFT : RIGHT);
    if (width / 2 - canvasTransform.x > 0) text(int(worldCanvasExtent / 2) - canvasTransform.x, 0, 0);
    resetMatrix();

    translate(4, constrain(height / 2 + canvasTransform.y + 2.5 - (canvasTransform.y <= 0 ? 0 : 5.5), 2.5, height - 3.5));
    rotate(90);
    textAlign(canvasTransform.y <= 0 ? LEFT : RIGHT);
    if (width / 2 + canvasTransform.x > 0) text("-" + (int(worldCanvasExtent / 2) + canvasTransform.x), 0, 0);
    resetMatrix();
    
    // Y-axis
    stroke(168, 50, 50);
    (canvasTransform.x <= -width / 2 || canvasTransform.x >= width/2) ? drawingContext.setLineDash([5, 5]) : drawingContext.setLineDash([]);
    line(constrain(int(canvasTransform.x) + width / 2, 0, width-1), -height, constrain(int(canvasTransform.x) + width / 2, 0, width-1), height);

    noStroke();
    fill(168, 50, 50);
    translate(constrain(width / 2 + canvasTransform.x + 2.5 - (canvasTransform.x <= 0 ? 0 : 5.5), 2.5, width - 3.5), height - 4);
    textAlign(canvasTransform.x <= 0 ? LEFT : RIGHT);
    if (height / 2 - canvasTransform.y > 0) text(int(worldCanvasExtent / 2) - canvasTransform.y, 0, 0);
    resetMatrix();

    translate(constrain(width / 2 + canvasTransform.x + 2.5 - (canvasTransform.x <= 0 ? 0 : 5.5), 2.5, width - 3.5), 10);
    textAlign(canvasTransform.x <= 0 ? LEFT : RIGHT);
    if (height / 2 + canvasTransform.y > 0) text("-" + (int(worldCanvasExtent / 2) - canvasTransform.y), 0, 0);
    resetMatrix();

    drawingContext.setLineDash([]);
    bez.draw();

    if (doMoveAll) {
        let centroid = canvasToWorld(bez.getCentroid());
        d_moveAllCheck.elt.firstChild.children[1].innerHTML = int(centroid.x) + ", " + int(centroid.y);
    }
    else d_moveAllCheck.elt.firstChild.children[1].innerHTML = " "
}

// ----- Callbacks ----- //

function changedMoveAllCheck() {
    doMoveAll = this.checked();
}

function changedMirroring() {
    mirroringState = this.value();
}

function changedTranslationX() {
    if (this.value() == '') this.value(0);

    canvasTransform.x = int(map(this.value(), -worldCanvasExtent/2, worldCanvasExtent/2, -100, 100));
    worldTransform.x = int(this.value());
    updateOutput();
}

function changedTranslationY() {
    if (this.value() == '') this.value(0);

    canvasTransform.y = int(map(this.value(), -worldCanvasExtent/2, worldCanvasExtent/2, -100, 100));
    worldTransform.y = int(this.value());
    updateOutput();
}

function changedScaling() {
    worldScale = this.value() < 0.5 ? map(this.value(), 0, 0.5, 0.1, 1) : map(this.value(), 0.5, 1, 1, 10);
    worldCanvasExtent = int(width * worldScale);
    d_translationInputs[0].value(int(canvasTransform.x * worldScale));
    d_translationInputs[1].value(int(canvasTransform.y * worldScale));
    updateOutput();
    select('#scalingSliderTitle').html("Scale (x" + nf(worldScale, 1, 1) + ")")
}

function changedRotaionAmnt() {
    if (this.value() < -180) this.value(-180);
    if (this.value() > 180) this.value(180);
}

function applyRotation() {
    bez.rotate(int(d_rotationElements[0].value()));
    updateOutput();

    d_rotationElements[0].value(0);
}

function copyOutput() {
    let stringToCopy = "bezier(";
    for (const p of bez.getPointsWorld()) {
        stringToCopy += int(p.x) + ", ";
        stringToCopy += int(p.y) + ", ";
    }
    stringToCopy = stringToCopy.slice(0, -2);
    stringToCopy += ");"

    copyToClipboard(stringToCopy);
}

function resetBez() {
    canvasTransform = createVector(0, 0);
    worldTransform = createVector(0, 0);
    worldScale = 1;
    worldCanvasExtent = width * worldScale;

    bez = new Bezier(width/2, height/2);

    d_translationInputs[0].value(0);
    d_translationInputs[1].value(0);
    d_scalingSlider.value(0.5);

    updateOutput();
}

function mousePressed() {
    if (doMoveAll) {
        isMovingBez = getCentroidUnderMouse();
    }
    else {
        selectedPoint = getPointUnderMouse();
    }
}

function mouseDragged() {
    if (isMovingBez) {
        let dVec = createVector(mouseX, mouseY).sub(bez.getCentroid());
        bez.move(dVec);
        updateOutput();
    }
    if (selectedPoint != null) {
        selectedPoint.point(mouseX, mouseY);

        if (mirroringState != "None") {
            bez.mirror(mirroringState);
        }

        updateOutput();
    }
}

function mouseReleased() {
    selectedPoint = null;
}

// ----- Functions ----- //

function getPointUnderMouse() {
    for (const p of bez.getPoints()) {
        if (p.hotSpotContains(mouseX, mouseY)) {
            return p;
        }
    }
    return null;
}

function getCentroidUnderMouse() {
    let centroid = bez.getCentroid();
    return dist(mouseX, mouseY, centroid.x, centroid.y) <= 5;
}

function worldToCanvas(vec) {
    let v = vec.div(worldScale);
            vec.add(worldTransform);
            vec.add(width/2, height/2);

    return v;
}

function canvasToWorld(vec) {
    let v = vec.mult(worldScale);
            vec.sub(worldTransform);
            vec.sub(width/2, height/2);

    return v;
}

function updateOutput() {
    let points = bez.getPointsWorld();
    let text = "" + 
        "Start: " + int(points[0].x) + ", " + int(points[0].y) + "<br>" +
        "Control Start: " + int(points[1].x) + ", " + int(points[1].y) + "<br>" +
        "Control End: " + int(points[2].x) + ", " + int(points[2].y) + "<br>" +
        "End: " + int(points[3].x) + ", " + int(points[3].y);

    // let text = "bezier(" +
    //         int(points[0].x) + ", " + int(points[0].y) + ", " +
    //         int(points[1].x) + ", " + int(points[1].y) + ", " +
    //         int(points[2].x) + ", " + int(points[2].y) + ", " +
    //         int(points[3].x) + ", " + int(points[3].y) + ");"

    d_outputPara.html(text);
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

// ----- Classes ----- //

class Bezier {
    #points

    constructor(x, y) {
        this.#points = [];
        this.#points.push(new Point(x - width / 10, y - height / 10, "#dad45e"));
        this.#points.push(new Point(x - width / 10, y + height / 10, "#dad45e"));
        this.#points.push(new Point(x + width / 10, y + height / 10, "#6dc2ca"));
        this.#points.push(new Point(x + width / 10, y - height / 10, "#6dc2ca"));
    }

    getStart() { return this.#points[0]; }
    getCtrlStart() { return this.#points[1]; }
    getCtrlEnd() { return this.#points[2]; }
    getEnd() { return this.#points[3]; }
    getPoints() { return this.#points; }
    getPointsWorld() {
        let pointsWorld = [];

        for (const p of this.#points) {
            let v = createVector(0, 0);
            v.add(p.getPoint());
            v.sub(width/2, height/2);
            v.sub(worldTransform.x, worldTransform.y);
            v.mult(worldScale);

            pointsWorld.push(v);
        }

        return pointsWorld;
    }
    getCentroid() {
        let centroid = createVector(0, 0);
        for (const p of this.#points) {
            centroid.add(p.getPoint());
        }
        centroid.div(4);
        return centroid;
    }
    move(dVec) {
        for (const p of this.#points) {
            p.getPoint().add(dVec);
        }
    }
    rotate(angle) {
        for (const p of this.#points) {
            let v = p.getPointWorld()
                v.rotate(angle);
                v = worldToCanvas(v);
            p.point(v.x, v.y);
        }
    }
    mirror(axis) {
        let index = this.#points.indexOf(selectedPoint);
        let indexToChange = 3 - index;
        let norm = axis == "X" ? createVector(0, 1) : axis == "Y" ? createVector(1, 0) : createVector(0, 0);
        let reflectedVector = p5.Vector.reflect(this.#points[index].getPointWorld(), norm);
        reflectedVector = worldToCanvas(reflectedVector);
        this.#points[indexToChange].point(reflectedVector.x, reflectedVector.y)
    }

    draw() {
        stroke("#deeed6");
		strokeWeight(1);
        line(this.#points[0].x(), this.#points[0].y(), this.#points[1].x(), this.#points[1].y());
        line(this.#points[2].x(), this.#points[2].y(), this.#points[3].x(), this.#points[3].y());

        stroke("#d04648");
		strokeWeight(2);
        noFill();
        bezier(
            this.#points[0].x(), this.#points[0].y(),
            this.#points[1].x(), this.#points[1].y(),
            this.#points[2].x(), this.#points[2].y(),
            this.#points[3].x(), this.#points[3].y()
        );

        for (const p of this.#points) {
            p.draw();
        }

        if (doMoveAll) {
            drawingContext.setLineDash([5, 7]);
            noFill();
            stroke(230, 70, 110);
            strokeWeight(2)
            
            beginShape();
            for (const p of this.#points) {
                vertex(p.getPoint().x, p.getPoint().y);
            }
            endShape(CLOSE);

            drawingContext.setLineDash([]);

            let centroid = this.getCentroid();
            noStroke();
            fill(230, 70, 110);
            beginShape();
            vertex(centroid.x, centroid.y + 5);
            vertex(centroid.x + 5, centroid.y);
            vertex(centroid.x, centroid.y - 5);
            vertex(centroid.x - 5, centroid.y);
            endShape(CLOSE);
            point(centroid.x, centroid.y)
        }
    }
}

class Point {
    #point;
    #color;

    constructor(x, y, col) {
        this.#point = createVector(x, y);
        this.#color = col;
    }

    draw() {
        noStroke();
        fill(this.#color);
        circle(this.x(), this.y(), 8);
    }

    x() { return this.#point.x; }
    y() { return this.#point.y; }
    getPoint() { return this.#point; }
    point(x, y) {
        this.#point.x = x;
        this.#point.y = y;
    }
    getPointWorld() {
        let v = createVector(0, 0);
            v.add(this.getPoint());
            v.sub(width/2, height/2);
            v.sub(worldTransform.x, worldTransform.y);
            v.mult(worldScale);

        return v;
    }

    hotSpotContains(x, y) {
        return dist(x, y, this.x(), this.y()) <= 4;
    }
}