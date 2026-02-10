import { useEffect } from "react"
import { Link } from "react-router-dom";



const Result = () =>  {
  useEffect(() => {
    console.log('Result 1111111111111111------------------------')
    // service.get('/avc')
    // post('http://www.baidu.com')
  }, [])


  return (
    <div>
      Result 结果页

      <Link to="/welcome">welcome</Link><br/><br/>
      <Link to="/home1">HOME1</Link>
    </div>
  )
}

export default Result
