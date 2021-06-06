import React, { useState, useEffect } from "react"

import "../assets/styles/index.scss"

const ScrollView = (props) => {
  const [currentScroll, setCurrentScroll] = useState(0);
  const [itemPos, setItemPos] = useState([]);
  const [itemTitles, setItemTitles] = useState([]);
  const [height, setHeight] = useState(100);
  
  const scrollHandler = () => {
    const parent = document.getElementById( props.ids[0] ).parentElement;
    const topY = document.getElementById( props.ids[0] ).offsetTop;
    const lastY = document.getElementById( props.ids[ props.ids.length - 1 ] ).offsetTop;
    let padding = parent.offsetTop + parent.offsetHeight - lastY;
    if( padding > window.innerHeight / 2 )
        padding = window.innerHeight / 2
    const totalLen = lastY - topY - padding;
    let bodyScroll = (window.scrollY - topY) / totalLen
    if( bodyScroll < 0 )
        bodyScroll = 0;
    if( bodyScroll > 1 )
        bodyScroll = 1;

    setCurrentScroll(bodyScroll);
  }

  const gotoSection = (amount) => {
    const parent = document.getElementById( props.ids[0] ).parentElement;
    const topY = document.getElementById( props.ids[0] ).offsetTop;
    const lastY = document.getElementById( props.ids[ props.ids.length - 1 ] ).offsetTop;
    let padding = parent.offsetTop + parent.offsetHeight - lastY;
    if( padding > window.innerHeight / 2 )
        padding = window.innerHeight / 2
    const totalLen = lastY - topY - padding;
    let scrollAmount = amount * totalLen + topY + 20;
    
    window.scrollTo({
      top: scrollAmount,
      left: 0,
      behavior: 'smooth'
    });
  }

  const resizeHandler = () => {
    const newPos = [];
    if( props.ids.length < 2 ) 
      return;
    const parent = document.getElementById( props.ids[0] ).parentElement;
    const topY = document.getElementById( props.ids[0] ).offsetTop;
    const lastY = document.getElementById( props.ids[ props.ids.length - 1 ] ).offsetTop;    
    let padding = parent.offsetTop + parent.offsetHeight - lastY;
    if( padding > window.innerHeight / 2 )
        padding = window.innerHeight / 2
    const totalLen = lastY - topY;
    const totalLenPadding = lastY - topY - padding;
    const rate = totalLenPadding / totalLen;
    const height = window.innerHeight * props.height;
    for(let i = 0; i < props.ids.length; i++) {
      const perc = ((document.getElementById( props.ids[i] ).offsetTop - topY) / totalLenPadding) * rate
      newPos[i] = {
        y: height * (document.getElementById( props.ids[i] ).offsetTop - topY) / totalLen,
        scroll: perc > 1 ? 1 : perc
      };
    }

    setHeight(window.innerHeight * props.height)

    setItemPos(newPos);
    scrollHandler();    
  }

  useEffect(() => {
    let titles = [];
    props.ids.map((id) => {
        titles.push( document.getElementById(id)?.innerText )        
    })
    setItemTitles(titles)

    resizeHandler();
    scrollHandler();

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', resizeHandler);
    // Remove event listeners on cleanup
    return () => {
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('scroll', scrollHandler);
    };
  }, [])


  return (
    <div className="scrollview-container">
      <div className="content">
        {props.children}
      </div>
      <div className="notification" style={{height: height}}>
          {props.ids.map((id, idx) => (
            <div key={idx} style={{position: 'absolute', right: 8, top: itemPos[idx]?.y}}>
              <span 
                className={"scrollText " + (currentScroll >= itemPos[idx]?.scroll ? "selected" : "") }
                onClick={() => gotoSection(itemPos[idx]?.scroll)}>
                {itemTitles[idx]}
              </span>
            </div>
          ))}
          <div className="scroll" style={{height: height}}>
          {props.ids.map((id, idx) => (
            <div 
              key={idx}
              className={"scrollDot " + (currentScroll >= itemPos[idx]?.scroll ? "selected" : "") }
              style={{top: itemPos[idx]?.y}}>                
            </div>
          ))}
          </div>
          <div className="scroll-fill" style={{height: height * currentScroll }}></div>
      </div>
    </div>
  )
}

export default ScrollView
