import { useEffect } from 'react'
import './index.less'

const Ahooks = () =>  {


  const onStart = () => {
    const observer = new IntersectionObserver(function (entries) {
      console.log('entries: ', entries)
    })
    observer.observe(document.querySelector('.home') as HTMLElement)

    const lis: any = document.querySelectorAll(`.home li`)

    const doms: HTMLElement[] = []
    for (let i = 0; i < lis.length; i++) {
       doms.push(lis[i] as HTMLElement)
       observer.observe(doms[i])
    }
  }
  //  observer.disconnect()

  useEffect(() => {
    onStart()
  }, [])

  return (
    <div>
      <div className="home">
        <ul>
          <li>111</li>
          <li>222</li>
          <li>333</li>
          <li>444</li>
          <li>555</li>
          <li>666</li>
        </ul>
      </div>
    </div>
  )
}

export default Ahooks
