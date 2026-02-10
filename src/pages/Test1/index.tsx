import { useEffect } from "react"


const Test1 = () =>  {
  useEffect(() => {
    console.log('Test 1111111111111111------------------------')
    // service.get('/avc')
    // post('http://www.baidu.com')
  }, [])


  return (
    <div>
      Test1 结果页
    </div>
  )
}

export default Test1
