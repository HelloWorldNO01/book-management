<template>

  
  <div class="root">

    <div v-if="isSheetShow" ref="sheet" class="sheet">

      <div class="loader-wrapper-container">

        <!-- From Uiverse.io by Nawsome --> 
        <div class="loader">
          <div>
            <ul>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
            </ul>
          </div><span>Loading</span></div>

        

      </div>
     

    </div>

    <main>

    <section class="intro">

      <section class="intro-title">

        <div class="intro-title-icon">

          <img style="align-content: center;" width="40px" height="40px" src="../res/logo.png">

        </div>


        <p>
            <span style="font-weight: 900;">墨阅</span>
            <br>
            <span style="font-weight: 100; font-family: Century Gothic; color: gray;">MOYUE LIBRARY</span>
       
       
        </p>


      </section>

      <section class="intro-text">

        <span style="font-weight: 900;font-size: 40px;">知识在这里汇集,</span>
        <span
          style="
            background: linear-gradient(10deg, #0b75e5 100%, #0b75e5);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-weight: 900;
            font-size: 40px;
          "
        >
          下一页由你开启。
        </span>
        <span style="margin-top: 10px; font-weight: bold; color: gray;">检索馆藏，管理借阅，接受归还提醒，让每一次阅读都有清晰的的开始和抵达</span>


      </section>

      <section class="intro-pic">

        <div class="intro-pic-window">

          <div class="window-title-bar">

            <div class="win-caption">

              <svg
                width="70px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="15" r="5" fill="#ff5f57" />
                <circle cx="30" cy="15" r="5" fill="#ffbd2e" />
                <circle cx="50" cy="15" r="5" fill="#28c840" />
              </svg>

              <span style=" margin-left: 5px; font-size: 12px; color: gray;">墨閲 > 圖書儀表盤</span>

            </div>

          </div> 

          <div
              class="window-content"
            >
              <!-- 左侧热门书架卡片 -->
              <section
                style="
                  flex: 1.7;
                  min-width: 0;
                  display: flex;
                  flex-direction: column;
                  padding: 38px 38px 28px;
                  overflow: hidden;
                  border-radius: 30px;
                  color: white;
                  background: linear-gradient(135deg, #1d344e, #315779);
                "
              >
                <h2
                  style="
                    margin: 0;
                    font-size: 28px;
                    line-height: 1.2;
                  "
                >
                  本月热门书架
                </h2>

                <p
                  style="
                    margin: 13px 0 0;
                    color: rgb(255 255 255 / 55%);
                    font-size: 14px;
                  "
                >
                  基于全校借阅趋势实时更新
                </p>

                <div
                  style="
                    position: relative;
                    display: flex;
                    flex: 1;
                    align-items: flex-end;
                    justify-content: space-around;
                    gap: 16px;
                    min-height: 220px;
                    margin-top: 18px;
                    padding: 0 18px 13px;
                  "
                >
                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 68%;
                      border-radius: 8px 8px 0 0;
                      background: #ef684e;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 84%;
                      border-radius: 8px 8px 0 0;
                      background: #4382c1;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 61%;
                      border-radius: 8px 8px 0 0;
                      background: #70b678;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 79%;
                      border-radius: 8px 8px 0 0;
                      background: #f0bb40;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 74%;
                      border-radius: 8px 8px 0 0;
                      background: #8e70b6;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 68%;
                      border-radius: 8px 8px 0 0;
                      background: #d74f6c;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 83%;
                      border-radius: 8px 8px 0 0;
                      background: #559d96;
                    "
                  ></div>

                  <div
                    style="
                      position: relative;
                      z-index: 1;
                      width: 44px;
                      height: 62%;
                      border-radius: 8px 8px 0 0;
                      background: #e97b39;
                    "
                  ></div>

                  <div
                    style="
                      position: absolute;
                      right: 0;
                      bottom: 5px;
                      left: 0;
                      height: 10px;
                      background: #547494;
                    "
                  ></div>
                </div>
              </section>

              <!-- 右侧两张卡片 -->
              <div
                style="
                  flex: 1;
                  min-width: 280px;
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                "
              >
                <section
                  style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 30px 34px;
                    border-radius: 30px;
                    background: #f5f8fc;
                  "
                >
                  <span
                    style="
                      color: #98a2b1;
                      font-size: 14px;
                    "
                  >
                    今日借阅
                  </span>

                  <strong
                    style="
                      margin-top: 18px;
                      color: #0f172a;
                      font-size: 42px;
                      line-height: 1;
                    "
                  >
                    186
                  </strong>

                  <div
                    style="
                      width: 100%;
                      height: 8px;
                      margin-top: 28px;
                      overflow: hidden;
                      border-radius: 999px;
                      background: #dce9f5;
                    "
                  >
                    <div
                      style="
                        width: 68%;
                        height: 100%;
                        border-radius: 999px;
                        background: #1680ef;
                      "
                    ></div>
                  </div>
                </section>

                <section
                  style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 30px 34px;
                    border-radius: 30px;
                    background: #f5f8fc;
                  "
                >
                  <span
                    style="
                      color: #98a2b1;
                      font-size: 14px;
                    "
                  >
                    馆藏在线率
                  </span>

                  <strong
                    style="
                      margin-top: 18px;
                      color: #0f172a;
                      font-size: 42px;
                      line-height: 1;
                    "
                  >
                    98.7%
                  </strong>

                  <div
                    style="
                      width: 100%;
                      height: 8px;
                      margin-top: 28px;
                      overflow: hidden;
                      border-radius: 999px;
                      background: #deefe8;
                    "
                  >
                    <div
                      style="
                        width: 96%;
                        height: 100%;
                        border-radius: 999px;
                        background: #27b875;
                      "
                    ></div>
                  </div>
                </section>
              </div>
          </div>

        </div>

      </section>


    </section>

    <div class="login-form-container">

      <form class="login-form" ref="loginForm">

        <span style="font-size: 35px; font-weight: 700;">登录</span>

        <span style="color: gray; margin-top: -15px;">欢迎回来，请登录后继续</span>

      
        <div style="margin-bottom: 10px; display: flex; flex-direction: column; position: relative;">

          <span style="margin-bottom: 5px; font-size: 15px; color: gray;">学号</span>

          <input @input="onStuidInput" name="studentId" placeholder="请输入学号" class="stuid lg-input">
          

          <Icon width="18" color="gray" style="position: absolute; left: 14px; top: 52%; " icon="bi:person-vcard"/>

        </div>
        

        <div style="display: flex; flex-direction: column;position: relative;">

          <span style="margin-bottom: 5px; font-size: 15px; color: gray;">密码</span>


          <input @input="onPsdInput" name="password" placeholder="请输入密码" type="password" class="psd lg-input">

          <Icon width="18" height="18" color="gray" style="position: absolute; left: 14px; top: 52%; " icon="bi:lock"/>

        </div>
        <div class="login-section">


          <input name="isRemember" class="reme" type="checkbox"> <span>记住我</span></input>

          <a class="fgp" href="https://www.baidu.com"> 忘记密码 </a>


        </div>


      <button type="button" v-on:click="loginClick()" class="login-butt">登录</button>

      <span class="status">{{status}}</span>



      </form>



      <span class="cyr">该系统由Lifei Software Corporation 提供</span>


    </div>

    </main>

   


   



  </div>

</template>

<style scoped>
  .status{
    color: red;
    text-align: center;
  }
  /* From Uiverse.io by Nawsome */ 
  .loader {
    --background: linear-gradient(135deg, #23C4F8, #275EFE);
    --shadow: rgba(39, 94, 254, 0.28);
    --text: #6C7486;
    --page: rgba(255, 255, 255, 0.36);
    --page-fold: rgba(255, 255, 255, 0.52);
    --duration: 3s;
    width: 200px;
    height: 140px;
    position: relative;
  }

  .loader:before, .loader:after {
    --r: -6deg;
    content: "";
    position: absolute;
    bottom: 8px;
    width: 120px;
    top: 80%;
    box-shadow: 0 16px 12px var(--shadow);
    transform: rotate(var(--r));
  }

  .loader:before {
    left: 4px;
  }

  .loader:after {
    --r: 6deg;
    right: 4px;
  }

  .loader div {
    width: 100%;
    height: 100%;
    border-radius: 13px;
    position: relative;
    z-index: 1;
    perspective: 600px;
    box-shadow: 0 4px 6px var(--shadow);
    background-image: var(--background);
  }

  .loader div ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
  }

  .loader div ul li {
    --r: 180deg;
    --o: 0;
    --c: var(--page);
    position: absolute;
    top: 10px;
    left: 10px;
    transform-origin: 100% 50%;
    color: var(--c);
    opacity: var(--o);
    transform: rotateY(var(--r));
    -webkit-animation: var(--duration) ease infinite;
    animation: var(--duration) ease infinite;
  }

  .loader div ul li:nth-child(2) {
    --c: var(--page-fold);
    -webkit-animation-name: page-2;
    animation-name: page-2;
  }

  .loader div ul li:nth-child(3) {
    --c: var(--page-fold);
    -webkit-animation-name: page-3;
    animation-name: page-3;
  }

  .loader div ul li:nth-child(4) {
    --c: var(--page-fold);
    -webkit-animation-name: page-4;
    animation-name: page-4;
  }

  .loader div ul li:nth-child(5) {
    --c: var(--page-fold);
    -webkit-animation-name: page-5;
    animation-name: page-5;
  }

  .loader div ul li svg {
    width: 90px;
    height: 120px;
    display: block;
  }

  .loader div ul li:first-child {
    --r: 0deg;
    --o: 1;
  }

  .loader div ul li:last-child {
    --o: 1;
  }

  .loader span {
    display: block;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 20px;
    text-align: center;
    color: var(--text);
  }

  @keyframes page-2 {
    0% {
      transform: rotateY(180deg);
      opacity: 0;
    }

    20% {
      opacity: 1;
    }

    35%, 100% {
      opacity: 0;
    }

    50%, 100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes page-3 {
    15% {
      transform: rotateY(180deg);
      opacity: 0;
    }

    35% {
      opacity: 1;
    }

    50%, 100% {
      opacity: 0;
    }

    65%, 100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes page-4 {
    30% {
      transform: rotateY(180deg);
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    65%, 100% {
      opacity: 0;
    }

    80%, 100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes page-5 {
    45% {
      transform: rotateY(180deg);
      opacity: 0;
    }

    65% {
      opacity: 1;
    }

    80%, 100% {
      opacity: 0;
    }

    95%, 100% {
      transform: rotateY(0deg);
    }
  }


  .loader-wrapper-container{
    align-self: center;
    width: 100%;

    justify-items: center;
    
  }



  .window-title-bar{
    background-color: #FDFDFF;
    flex:20%;
    border-top-left-radius: 20px;
    border-bottom: 2px #F0F0F2 solid;
    display: flex;
    padding: 20px;
  }

  .window-content{
    flex: 80%;
    background-color: #FAFCFF; 
    padding: 10px;
    display: flex;
    gap: 24px;
    width: 100%;
    height: 400px;
    font-family: sans-serif;
  }

  .intro-pic-window{
    box-shadow: -16px -15px 100px rgba(205, 203, 203, 0.393);
    
    margin-left: 50px;
    height: 100%;
    border-radius: 20px 0px 0px 0px;
    background-color: white;

    position: relative;

    top: 20px;
    left: 10px;
    
    
    display: flex;
    flex-direction: column;
    transform: rotate(-2deg);
    
  }

  .sheet{

    display: flex;

    opacity: 0;

    position: fixed;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    z-index: 100;

    background: rgba(33, 33, 33, 0.2);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  main{
    height: 100vh;
    display: flex;
    
  }

  .intro{
    flex: 60%;
    display: grid;

    grid-template-rows: 10% 60% 30%;

    background: linear-gradient(100deg,
    #eaf4ff 0%,
  #f6f9ff 55%,
  #f4f2ff 100%);

    overflow: hidden;

  }

  .intro-title-icon{
    display: flex; 
    align-items: center; 
    border-radius: 16px;  
    width: 50px;
    height: 50px; 
    
  }

  .intro-title{

    grid-row: 1;
    display: flex;

    flex-direction: row;

    align-items: center;

    padding: 10px;
    margin-left: 70px;
    margin-top: 20px;

    gap: 5px;

  }

  .intro-text{

    grid-row: 2;

    padding: 90px;

    display: flex;

    flex-direction: column;
    gap: 5px;

  }

  .intro-pic{

    grid-row: 3;

  }

 
  .lg-input {
    width: 400px;
    height: 60px;

    border: 2px solid #f4f4f6;
    border-radius: 16px;
    outline: 0;

    background-color: white;

    
    font-size: 15px;
    text-indent: 37px;

    transition:
      border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      background-color 0.3s ease,
      box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .lg-input:focus {
    border-color: #107ef5;

    background-color: #ffffff;

    box-shadow:
      0 0 0 4px rgba(16, 126, 245, 0.12),
      0 10px 30px rgba(16, 126, 245, 0.1);

    outline: none !important;
  }

  .lg-input::placeholder {
    color: #a2aab6;
    

    transition:
        color 0.25s ease;
    }

    .lg-input:focus::placeholder {
      color: #c1c8d1;
    }

    .login-form-container{
      flex: 40%;
      height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
    }
  .login-form{
    
    display: flex;
    flex-direction: column;
    gap: 20px;

    width: 400px;

    margin-top: auto;
    margin-bottom: auto;
    

  }

  .login-form > *{
    width: 400px;
  }

  .reme{
    width: 20px;
  }

  .fgp{
    color: #107ef5;
    font-weight: 600;
  }

  .fgp:hover{

    color: #299fff;

  }

  .login-butt {
    width: 400px;
    height: 50px;

    border: 1px solid #b8cee8;
    border-radius: 15px;

    color: white;
    cursor: pointer;

    background-color: #107ef5;

    box-shadow:
      0 6px 24px rgba(16, 127, 245, 0.18),
      0 0 80px rgba(16, 127, 245, 0.25);

    transform: translateY(0) scale(1);

    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      background-color 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .login-butt:hover {
    background-color: #2a88ed;
    border-color: #0980ff;

    transform:  scale(1.001);

    box-shadow:
      0 10px 30px rgba(16, 127, 245, 0.28),
      0 0 100px rgba(16, 127, 245, 0.32);
  }

  .login-butt:active {
    background-color: #086bd3;

    transform: translateY(0) scale(0.985);

    box-shadow:
      0 3px 12px rgba(16, 127, 245, 0.24),
      0 0 50px rgba(16, 127, 245, 0.2);

    transition-duration: 0.1s;
  }

 

  .login-section{
    display: flex;
  }

  .cyr{
    width: 400px;
    margin-bottom: 10px;

    align-self: center;

    color: gray;
    text-align: center;
  }

  .fgp{
    margin-left: auto;
  }

  
 @media (max-width:130vh) {

    .intro{
      display: none;
    }
    
  }


</style>

<script setup>
  import { nextTick } from 'vue';

  import { Icon } from '@iconify/vue';

  import { gsap } from 'gsap';

  import { ref } from 'vue';


  const isSheetShow = ref(false);

  const sheet = ref(null);

  const loginForm = ref(null);

  const status = ref("");

  const statusCode = ref(0);

  const isStuidWrong = ref(false);

  const isPsdWrong = ref(false);

  import http from "../api/http"
import { useRouter } from 'vue-router';
  
  const router = useRouter();

  function showLoading(){
    isSheetShow.value = true;

    nextTick(()=>{
      gsap.fromTo(sheet.value, {
        opacity: 0
      },
      {
        duration: 0.6,
        opacity: 1,
        ease: "back.in"
      });


    
    });

  }

  function closeLoading(){
    isSheetShow.value = false;
  }

  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  function shaking(sel){
    gsap.timeline()
    .to(sel,{
      outline:"2px solid red",
      duration: 0.02
    })
    .to(sel, {
      x: -10,
      duration: 0.06
    })
    .to(sel, {
      x: 10,
      duration: 0.08
    })
    .to(sel, {
      x: -8,
      duration: 0.08
    })
    .to(sel, {
      x: 8,
      duration: 0.08
    })
    .to(sel, {
      x: -4,
      duration: 0.07
    })
    .to(sel, {
      x: 4,
      duration: 0.07
    })
    .to(sel, {
      x: 0,
      duration: 0.06
    })
   
  }

  async function loginClick(){

    const login = new FormData(loginForm.value);

    let password = login.get("password");
    let stuId = login.get("studentId");

    let isRemember = login.has("isRemember");

  
    let reses = validate(stuId, password);

    let res = reses[0];

    if(res != 0){

      if(res == 1 || res == 4) {
        isPsdWrong.value = true;
        shaking(".psd");
      }

      else if(res == 2 || res == 5) {
        isStuidWrong.value = true;
        shaking(".stuid")
      }

      else if(res >= 3){
        isPsdWrong.value = true;
        shaking(".psd");
        isStuidWrong.value = true;
        shaking(".stuid")
        if(res == 9)
          reses[1] = "无效学号或密码，学号要求12位，密码最少8位"

      }

      status.value = reses[1];

      statusCode.value = res;

    }else{

      showLoading();

      await sleep(2000); 

      http.post("/login",{
          studentId: stuId,
          password: password
      }).then(()=>{

        router.replace("/dashbroad");

      }).catch((err)=>{

        shaking(".psd");
        shaking(".stuid");
        status.value = err; 

      }).finally(()=>{
        closeLoading();
      });

    }

    

  
   


    


    
     

   


  }

  function validate(stuId, password){
    let i = 0;
    let status = "";
    if(password.length == 0 || stuId.length ==0){
      status = "请输入用户名或密码"
      if(password.length == 0)   
        i += 1;
      if(stuId.length == 0)
        i += 2;

    }else{
      if(password.length < 8){
        status = "无效密码，密码至少为8位"
        i += 4;
      }

      if(stuId.length < 12){
        status = "无效学号，学号至少12位"
        i += 5;
      }
    }

    return [i, status];
  }

  function onPsdInput(event){
    const value = event.currentTarget.value;


    function recover(){
      gsap.set(".psd",{outline:"0"})
      status.value = "";
    }

    if(isPsdWrong){
      if(statusCode.value == 4 || statusCode.value == 3){
        if(value.length > 0) recover();
      }else{
        if(value.length >= 8) recover();
      }
      
    }
    
  }

  function onStuidInput(event){
    const value = event.currentTarget.value;
    function recover(){
      gsap.set(".stuid",{outline:"0"})
      status.value = "";
    }

    if(isStuidWrong){
      if(statusCode.value == 5 || statusCode.value == 3){
        if(value.length > 0) recover();
      }else{
        if(value.length >= 12) recover();
      }
      
    }
  }


</script>