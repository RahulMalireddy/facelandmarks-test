import { Component, ViewChild, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { FaceLandMarkDrawingUtilitiesService } from './face-land-mark-drawing-utilities.service';
import * as cloneDeep from 'lodash/cloneDeep';
import * as tf from '@tensorflow/tfjs-core';
//import '@tensorflow/tfjs-node-gpu';
//import '@tensorflow/tfjs-converter';
//import '@tensorflow/tfjs-backend-cpu';
//import '@tensorflow/tfjs-backend-webgl';
//import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as facemesh from "@tensorflow-models/face-landmarks-detection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('webcam1') Webcam1;
  @ViewChild('canvas1') canvas1: ElementRef;
  public CanvasContext = null;
  public CameraIsSet = false;
  public videostream = null;
  public ShowLandMarks = false;
  title = 'MakeMeUp';

  constructor(private DrawingUtil: FaceLandMarkDrawingUtilitiesService) {
    //tfjsWasm.setWasmPaths( `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`);
  }
  ngOnInit() {
    tf.ENV.set("WEBGL_CPU_FORWARD", true);
    var j=tf.ENV.getBool('WEBGL_RENDER_FLOAT32_CAPABLE');
    console.log(j);
    //tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
    //tfjsWasm.version_wasm}/dist/`);
  }
  ngAfterViewInit() {
    // console.log('Using TensorFlow backend: ', tf.getBackend());
    //tf.ENV.set("WEBGL_CPU_FORWARD", true)
    console.log(this.canvas1);
    this.CanvasContext = this.canvas1.nativeElement.getContext("2d");
    this.Setup();


  }
  public async Setup() {
    if (!this.CameraIsSet) {
      await this.EvaluateSetWebcam();
      await tf.backend();
      //.then(result=>{
      // console.log(result);
      //tf.backend();
      var t = tf.getBackend();
      console.log(t);
      this.CameraIsSet = true;
      //this.Webcam1.nativeElement.onloadeddata = async (event) => {
      //  this.CameraIsSet=true;
      //  this.DrawFaces();
      // };
      var fn = this.DrawFaces();
      this.DrawFaces();
      //setInterval(()=>{this.DrawFaces()},10);
      // })
      //.catch(error=>{
      // console.log(error);
      // }

      // );


    }
  }
  public async DrawFaces() {
    if (this.ShowLandMarks) {
      const model = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);

      const predictions = await model.estimateFaces({
        input: this.Webcam1.nativeElement
      });


      console.log(predictions);
      if (predictions.length > 0) {
        predictions.forEach(prediction => {
          var temp3 = prediction as any;
          var keypoints = temp3.scaledMesh;
          //for (let i = 0; i < keypoints.length; i++) {
          //  const [x, y, z] = keypoints[i];
          //console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
          //}

        });
        var tempThis=this;
        requestAnimationFrame(() => { this.DrawingUtil.drawMesh(predictions, this.CanvasContext, this.canvas1.nativeElement);tf.dispose(); tempThis.DrawFaces();});
        
        /*
        for (let i = 0; i < predictions.length; i++) {
          console.log(predictions[i]);
          console.log(typeof predictions[i]);
          if(predictions[i]){
            var temp=cloneDeep(predictions[i]);
            console.log(typeof temp);
            console.log(temp);
            
           //if(predictions[i]&&predictions[i].hasOwnProperty('scaledMesh')){
            predictions[i]=predictions[i] as any;
            var keypoints = temp.scaledMesh;
            for (let i = 0; i < keypoints.length; i++) {
              const [x, y, z] = keypoints[i];
              console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            }
           //}
          }
          //const keypoints = predictions[i].scaledMesh;
  
          // Log facial keypoints.
          //for (let i = 0; i < keypoints.length; i++) {
          //  const [x, y, z] = keypoints[i];
  
          //  console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
         // }
        }*/

      }
    }
  }
  public async EvaluateSetWebcam() {
    //console.log(this.Webcam1);
    // console.log(navigator.mediaDevices)

    var tempThis = this;
    if (navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          tempThis.Webcam1.nativeElement.srcObject = stream;
          // tempThis.videostream = tempThis.Webcam1.nativeElement.srcObject;
          //console.log(tempThis.Webcam1.nativeElement.srcObject)
        })
        .catch(function (err0r) {
          console.log(err0r);
          console.log("Something went wrong!");
        });
    }
  }



}
