import { useEffect, useRef } from "react"
import { Canvas, FabricText, Rect, Circle, Triangle } from 'fabric';

const Test2 = () =>  {
  const canvasEl = useRef<any>(null);

  useEffect(() => {
    console.log('Test 1111111111111111------------------------')
    // service.get('/avc')
    // post('http://www.baidu.com')
  }, [])

  useEffect(() => {
    const options = {  };
    const canvas = new Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    const helloWorld = new FabricText('Hello world!');
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 20,
      height: 20,
      fill: 'red',
      // angle: 45
    });
    const circle = new Circle({
      radius: 20, fill: 'green', left: 100, top: 100
    });
    const triangle = new Triangle({
      width: 20, height: 30, fill: 'blue', left: 50, top: 50
    });

    canvas.add(rect);

    rect.set('fill', 'red');
    rect.set({ strokeWidth: 5, stroke: 'rgba(44, 255, 2, 0.5)' });
    rect.set('angle', 15).set('flipY', true);


    canvas.add(circle);
    canvas.add(triangle);
    canvas.add(helloWorld);
    canvas.centerObject(helloWorld);
  }, []);


  return (
    <div>
      Test2 结果页
      <canvas width="300" height="300" ref={canvasEl} />
    </div>
  )
}

export default Test2
