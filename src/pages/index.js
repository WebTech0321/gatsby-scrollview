import React, { useState, useEffect } from "react"
import { data } from '../data/fake'

import "../assets/styles/index.scss"

const SCROLL_HEIGHT = 240

// markup
const IndexPage = () => {
  const [currentScroll, setCurrentScroll] = useState(0);
  const [itemPos, setItemPos] = useState([]);
  
  const scrollHandler = () => {
    let bodyScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    setCurrentScroll(bodyScroll);
  }

  const resizeHandler = () => {
    const newPos = [];
    if( data.length < 2 ) 
      return;
    const topY = document.getElementById( data[0].id ).offsetTop;
    const lastY = document.getElementById( data[ data.length - 1 ].id ).offsetTop;
    const totalLen = lastY - topY;
    for(let i = 0; i < data.length; i++) {
      newPos[i] = {
        y: SCROLL_HEIGHT * (document.getElementById( data[i].id ).offsetTop - topY) / totalLen,
        scroll: (document.getElementById( data[i].id ).offsetTop - topY) / totalLen
      };
    }
    setItemPos(newPos);
  }

  useEffect(() => {
    resizeHandler();

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', resizeHandler);
    // Remove event listeners on cleanup
    return () => {
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('scroll', scrollHandler);
    };
  }, [])

  const gotoSection = (amount) => {
    let scrollAmount = amount * (document.body.scrollHeight - window.innerHeight)
    window.scrollTo({
      top: scrollAmount,
      left: 0,
      behavior: 'smooth'
    });
  }

  return (
    <main className="pageContainer">
      <div className="content">
        {data.map((item) => (
          <div key={item.id}>
            <h2 id={item.id}>{item.title}</h2>
            {item.descriptions.map((desc, descIdx) => (
              <p key={descIdx}>
                {desc}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="notification">
          {data.map((item, idx) => (
            <div key={idx} style={{position: 'absolute', right: 8, top: itemPos[idx]?.y}}>
              <span 
                className={"scrollText " + (currentScroll >= itemPos[idx]?.scroll ? "selected" : "") }
                onClick={() => gotoSection(itemPos[idx]?.scroll)}>
                {item.title}
              </span>
            </div>
          ))}
          <div className="scroll">
          {data.map((item, idx) => (
            <div 
              key={idx}
              className={"scrollDot " + (currentScroll >= itemPos[idx]?.scroll ? "selected" : "") }
              style={{top: itemPos[idx]?.y}}>                
            </div>
          ))}
          </div>
          <div className="scroll-fill" style={{height: SCROLL_HEIGHT * currentScroll }}></div>
      </div>
    </main>
  )
}

export default IndexPage
