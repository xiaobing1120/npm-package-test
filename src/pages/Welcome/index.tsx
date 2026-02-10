import { useEffect } from "react"


const Welcome = () =>  {

  useEffect(() => {
    console.log('Welcome 1111111111111111------------------------')
    // service.get('/avc')
    // post('http://www.baidu.com')
  }, [])


  return (
    <div>
      Welcome 欢迎页
    </div>
  )
}

export default Welcome
