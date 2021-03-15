import * as THREE from "three";

import body_0 from "../../assets/firl/body_0.json";
import body_1 from "../../assets/firl/body_1.json";

import eye_brown_l from "../../assets/firl/eye_brown_l.json";
import eye_brown_r from "../../assets/firl/eye_brown_r.json";

import eye_l from "../../assets/firl/eye_l.json";
import eye_r from "../../assets/firl/eye_r.json";

import face_silu from "../../assets/firl/face_silu.json";

import hair_0 from "../../assets/firl/hair_0.json";
import hair_1 from "../../assets/firl/hair_1.json";
import hair_2 from "../../assets/firl/hair_2.json";
import hair_3 from "../../assets/firl/hair_3.json";

import hand_2 from "../../assets/firl/hand_2.json";
import hand_3 from "../../assets/firl/hand_3.json";
import hand_4 from "../../assets/firl/hand_4.json";
import hand_5 from "../../assets/firl/hand_5.json";
import hand_6 from "../../assets/firl/hand_6.json";
import hand_7 from "../../assets/firl/hand_7.json";
import hand_8 from "../../assets/firl/hand_8.json";
import hand_9 from "../../assets/firl/hand_9.json";
import hand_10 from "../../assets/firl/hand_10.json";

import nose from "../../assets/firl/nose.json";

import mouth from "../../assets/firl/mouth.json";

import { Drawing } from "../drawing";
import { Object3D, Matrix, Matrix4 } from "three";

export class Firl {
  public handParent: Object3D;

  scale = 2;
  transform_x = 0;
  transform_z = -20;


  constructor(
    scene: THREE.Scene,
    sec: number,
    delay: number = 0,
    fps: number = 60
  ) {
    var drawArr = [
      nose,
      mouth,
      body_0,
      body_1,
      eye_brown_l,
      eye_brown_r,
      eye_l,
      eye_r,
      face_silu,
      hair_0,
      hair_1,
      hair_2,
      hair_3,
    ];

    var handDraw = [
      hand_2,
      hand_3,
      hand_4,
      hand_5,
      hand_6,
      hand_7,
      hand_8,
      hand_9,
      hand_10,
    ];

    var drawArrZScale = [1, 3, 6, 9, 12, 15, 18, 21, 24];

    for (var i = 0; i < drawArr.length; i++) {
      // //Face
      var data = this.mapData(drawArr[i], 1);
      var maxPoints = Object.keys(data).length;
      // world
      var lineGeometry = new THREE.BufferGeometry();
      var positions = new Float32Array(maxPoints * 3);
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // draw range
      lineGeometry.setDrawRange(0, 0);
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      var line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      var drawing = new Drawing(data, line, fps);
      drawing.draw(sec, delay);
    }

    this.handParent = new Object3D();

    //Hand
    for (var i = 0; i < handDraw.length; i++) {
      var scale = drawArrZScale[i];
      var data = this.mapData(handDraw[i], scale);
      var maxPoints = Object.keys(data).length;
      // world
      var lineGeometry = new THREE.BufferGeometry();
      var positions = new Float32Array(maxPoints * 3);
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // draw range
      lineGeometry.setDrawRange(0, 0);
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      var line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      var drawing = new Drawing(data, line, fps);
      drawing.draw(sec, delay);

      this.handParent.add(line);
    }

    scene.add(this.handParent);
  }

  mapData(data: any, scale: number): any {
    var res: { [key: string]: number } = {};
    var i = 0;
    for (let key in data) {
      var obj = data[key];
      res[i + ""] = (obj[0] + this.transform_x) * this.scale ;
      res[i + 1 + ""] = (obj[1] ) * this.scale;
      res[i + 2 + ""] = ((obj[2] * scale) + + this.transform_z) * this.scale;
      i += 3;
    }
    return res;
  }

  rotateHand(matrix: Matrix4) {
    var eyes = this.handParent.children;
    for (var i = 0; i < eyes.length; i++) {
      eyes[i].setRotationFromMatrix(matrix);
    }
  }
}
