<template>
  <div class="home">
    <div class="home__header">
      <div class="left">
        <img src="../../assets/user_icon.jpg" alt="" class="logo"/>
        <div class="user-info">
          <h1 class="user-info__name">{{ tr('你好')}}{{state.infoData?.name}}，{{tr('欢迎使用')}}</h1>
          <div class="user-info__message">
            {{ tr('上次登录IP') }}：
            {{ state.infoData?.loginIp }}，
            {{ tr('登录时间') }}：
            {{ state.infoData?.loginTime }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-item">
          <div class="item-title">{{ tr('总额') }}</div>
          <div class="item-value">{{ tool.groupSeparator(parseFloat(state.balance.t || '0').toFixed(2)) }}</div>
        </div>
        <div class="right-item">
          <div class="item-title">{{ tr('可用余额') }}</div>
          <div class="item-value">{{ tool.groupSeparator(parseFloat(state.balance.a || '0').toFixed(2)) }}</div>
        </div>
        <div class="right-item">
          <div class="item-title">{{ tr('待结算余额') }}</div>
          <div class="item-value">{{ tool.groupSeparator(parseFloat(state.balance.f || '0').toFixed(2)) }}</div>
        </div>
      </div>
    </div>
    <div class="home__body">
      <div class="body-amount">
        <div class="card">
          <div class="card__header">{{ tr('今日数据总览') }}</div>
          <div class="card__body">
            <div class="body-item">
              <div class="item-header">
                <span class="header-title">{{ tr('收款') }}</span>
                <div  class="item-value">
                  <span>{{
                      tool.groupSeparator(parseFloat(state.amountInfo.a || '0').toFixed(2))
                    }}</span>
                  <span style="font-size: 40px; color: rgb(141, 199, 242)">
                     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          aria-hidden="true" role="img" class="iconify iconify--ion" width="1em" height="1em"
                          preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="currentColor"
                                                                                          d="M424.81 148.79c-.43 2.76-.93 5.58-1.49 8.48c-19.17 98-84.76 131.8-168.54 131.8h-42.65a20.67 20.67 0 0 0-20.47 17.46l-21.84 137.84l-6.18 39.07a10.86 10.86 0 0 0 9.07 12.42a10.72 10.72 0 0 0 1.7.13h75.65a18.18 18.18 0 0 0 18-15.27l.74-3.83l14.24-90l.91-4.94a18.16 18.16 0 0 1 18-15.3h11.31c73.3 0 130.67-29.62 147.44-115.32c7-35.8 3.38-65.69-15.16-86.72a72.27 72.27 0 0 0-20.73-15.82Z"></path><path
                         fill="currentColor"
                         d="M385.52 51.09C363.84 26.52 324.71 16 274.63 16H129.25a20.75 20.75 0 0 0-20.54 17.48l-60.55 382a12.43 12.43 0 0 0 10.39 14.22a12.58 12.58 0 0 0 1.94.15h89.76l22.54-142.29l-.7 4.46a20.67 20.67 0 0 1 20.47-17.46h42.65c83.77 0 149.36-33.86 168.54-131.8c.57-2.9 1.05-5.72 1.49-8.48c5.7-36.22-.05-60.87-19.72-83.19Z"></path></svg>
                  </span>
                </div>
              </div>
              <div class="item-footer">
                <span>{{ tr('成功收款数') }}</span>
                <span>{{ state.amountInfo.aa }}</span>
              </div>
            </div>
            <div class="body-item">
              <div class="item-header">
                <span class="header-title">{{ tr('打款') }}</span>
                <div class="item-value">
                  <span>{{
                      tool.groupSeparator(parseFloat(state.amountInfo.b || '0').toFixed(2))
                    }}</span>
                  <span style="font-size: 40px; color: rgb(63, 178, 127)">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         aria-hidden="true" role="img" class="iconify iconify--ion" width="1em" height="1em"
                         preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path
                        d="M399.8 203c-.8-17.1-3.3-34.5-10.8-50.1-4.1-8.6-9.7-16.5-16.5-23.2-6.3-6.4-13.6-11.7-21.3-16.3-17.1-10.2-37.5-17-84.4-31S192 64 192 64v358.3l79.9 25.7s.1-198.8.1-299.5v-3.8c0-9.3 7.5-16.8 16.1-16.8h.5c8.5 0 15.5 7.5 15.5 16.8V278c11 5.3 29.2 9.3 41.8 9.1 8.3.2 16.7-1.7 24-5.7 7.6-4.1 13.9-10.4 18.4-17.8 5.1-8.3 8.2-17.8 9.9-27.3 1.9-10.8 2-22.1 1.6-33.3z"
                        fill="currentColor"></path><path
                        d="M86.7 357.8c27.4-9.8 89.3-29.5 89.3-29.5v-47.2s-76.5 24.8-111.3 37.1c-8.6 3.1-17.3 5.9-25.7 9.5-9.8 4.1-19.4 8.7-28.1 14.8-3.8 2.6-7.2 5.9-9.2 10.1-2 4.2-2.2 9.2-.5 13.6 2 5.1 5.8 9.3 10.1 12.6 7.8 5.9 17.1 9.5 26.4 12.2 28.4 9.4 58.4 14 88.4 13.3 14.5-.2 36-1.9 50-4.4v-42s-11 2.5-41.3 12.5c-4.6 1.5-9.2 3.3-14 4.3-7.1 1.6-14.4 2.1-21.6 2.2-6.5-.3-13.2-.7-19.3-3.1-2.2-1-4.6-2.2-5.5-4.6-.8-2 .3-4 1.7-5.4 2.8-2.9 6.8-4.5 10.6-6z"
                        fill="currentColor"></path><path
                        d="M512 345.9c-.1-6-3.7-11.2-7.9-15-7.1-6.3-15.9-10.3-24.7-13.5-5.5-1.9-9.3-3.3-14.7-5-25.2-8.2-51.9-11.2-78.3-11.3-8 .3-23.1.5-31 1.4-21.9 2.5-67.3 15.4-67.3 15.4v48.8s67.5-21.6 96.5-31.8c9.7-3.3 20.1-4.6 30.3-4.6 6.5.2 13.2.7 19.4 3.1 2.2.9 4.5 2.2 5.5 4.5.9 2.6-.9 5-2.9 6.5-4.7 3.8-10.7 5.3-16.2 7.4-41 14.5-132.7 44.7-132.7 44.7v47s117.2-39.6 170.8-58.8c8.9-3.3 17.9-6.1 26.4-10.4 7.9-4 15.8-8.6 21.8-15.3 3.1-3.6 5-8 5-13.1z"
                        fill="currentColor"></path></svg>
                    </span>
                </div>
              </div>
              <div class="item-footer">
                <span>{{ tr('成功打款数') }}</span>
                <span>{{ state.amountInfo.bb }}</span>
              </div>
            </div>
            <div class="body-item">
              <div class="item-header">
                <span class="header-title">{{ tr('提现/转账') }}</span>
                <div  class="item-value">
                  <span>{{
                      tool.groupSeparator(parseFloat(state.amountInfo.c  || '0').toFixed(2))
                    }}</span>
                  <span style="font-size: 40px; color: rgb(225, 133, 37)">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                       role="img" class="iconify iconify--ion" width="1em" height="1em"
                       preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512">
                    <path
                        d="M352 32v35h63.1l-81.4 80.5c-7.5-7.2-13.2-11-13.2-11C302.2 123.6 280 116 256 116c-30.2 0-57.6 12-77.8 31.4l-15.2-15 31.4-31.4-28.5-28.5-31.5 31.5-37.5-37H160V32H32v128h35V91.3l40.3 39.9-31.2 31.2 28.5 28.5 31.4-31.4 19.4 19.2c-7.3 14.9-11.5 31.7-11.5 49.5 0 54.8 39.5 100.4 91.1 110.2v45.3h-63V424h63v56h42v-56h63v-40.2h-63v-45.3c50.8-9.9 91.2-55.5 91.2-110.3 0-17.7-4.2-34.8-11.5-49.6L445 91.3V160h35V32H352zm-96 258c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"
                        fill="currentColor"></path>
                  </svg>
                  </span>
                </div>
              </div>
              <div class="item-footer">
                <span class="header-title">{{ tr('成功单数') }}</span>
                <span>{{ state.amountInfo.cc }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card router">
          <div class="card__header">{{ tr('快捷导航') }}</div>
          <div class="card__body card__grid__body">
            <div class="body-item">
              <div class="item-content" @click="go2Path('/withdrawal/all')">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgb(0, 216, 255); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bi" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="currentColor"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"></path><path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317c0-.185-.158-.31-.361-.31c-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787c.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8c-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309c.254 0 .424-.145.422-.35c-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844c.583 0 .96.326.96.756c0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508c0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"></path></g></svg></span>
                <span>{{ tr('提现订单') }}</span>
              </div>
            </div>
            <div class="body-item" @click="go2Path('/orders/all')">
              <div class="item-content">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgb(191, 12, 44); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ant-design" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path fill="currentColor" d="M920 760H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-568H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H336c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM216 712H100c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h72.4v20.5h-35.7c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h35.7V838H100c-2.2 0-4 1.8-4 4v34c0 2.2 1.8 4 4 4h116c2.2 0 4-1.8 4-4V716c0-2.2-1.8-4-4-4zM100 188h38v120c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V152c0-4.4-3.6-8-8-8h-78c-2.2 0-4 1.8-4 4v36c0 2.2 1.8 4 4 4zm116 240H100c-2.2 0-4 1.8-4 4v36c0 2.2 1.8 4 4 4h68.4l-70.3 77.7a8.3 8.3 0 0 0-2.1 5.4V592c0 2.2 1.8 4 4 4h116c2.2 0 4-1.8 4-4v-36c0-2.2-1.8-4-4-4h-68.4l70.3-77.7a8.3 8.3 0 0 0 2.1-5.4V432c0-2.2-1.8-4-4-4z"></path></svg></span>
                <span>{{ tr('代收订单') }}</span>
              </div>
            </div>
            <div class="body-item" @click="go2Path('/payout/all')">
              <div class="item-content">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgb(225, 133, 37); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--clarity" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36"><path fill="currentColor" d="M2 8h2v2H2z" class="clr-i-outline clr-i-outline-path-1"></path><path fill="currentColor" d="M7 10h24a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2Z" class="clr-i-outline clr-i-outline-path-2"></path><path fill="currentColor" d="M2 14h2v2H2z" class="clr-i-outline clr-i-outline-path-3"></path><path fill="currentColor" d="M31 14H7a1 1 0 0 0 0 2h24a1 1 0 0 0 0-2Z" class="clr-i-outline clr-i-outline-path-4"></path><path fill="currentColor" d="M2 20h2v2H2z" class="clr-i-outline clr-i-outline-path-5"></path><path fill="currentColor" d="M31 20H7a1 1 0 0 0 0 2h24a1 1 0 0 0 0-2Z" class="clr-i-outline clr-i-outline-path-6"></path><path fill="currentColor" d="M2 26h2v2H2z" class="clr-i-outline clr-i-outline-path-7"></path><path fill="currentColor" d="M31 26H7a1 1 0 0 0 0 2h24a1 1 0 0 0 0-2Z" class="clr-i-outline clr-i-outline-path-8"></path><path fill="none" d="M0 0h36v36H0z"></path></svg></span>
                <span>{{ tr('代付订单') }}</span>
              </div>
            </div>
            <div class="body-item" @click="go2Path('/account/bassicinfo')">
              <div class="item-content">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgb(31, 218, 202); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ion" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><rect width="176" height="176" x="48" y="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"></rect><rect width="176" height="176" x="288" y="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"></rect><rect width="176" height="176" x="48" y="288" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"></rect><rect width="176" height="176" x="288" y="288" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"></rect></svg></span>
                <span>{{ tr('基本信息') }}</span>
              </div>
            </div>
            <div class="body-item" @click="go2Path('/appConfig')">
              <div class="item-content">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgb(63, 178, 127); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ion" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4ZM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155.3 155.3 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155.3 155.3 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47Z"></path></svg></span>
                <span>{{ tr('应用配置') }}</span>
              </div>
            </div>
            <div class="body-item" @click="go2Path('/application/va')">
              <div class="item-content">
                <span class="app-iconify anticon" style="font-size: 20px; color: rgba(77, 175, 27, 0.79); display: inline-flex;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--vscode-icons" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="#9e90c1" d="M12.511 17.189c-.164-6.811-.324-12.408-.356-12.44a7.886 7.886 0 0 0-2.264 1.164a7.578 7.578 0 0 0-2.545 3.3a8.39 8.39 0 0 0-.585 3.529a4.647 4.647 0 0 0 .2 1.955a3.4 3.4 0 0 1 .182.558c-.012.009-.337-.018-.722-.061c-1.861-.206-2.776-1.046-2.991-2.747a6.288 6.288 0 0 1 1.449-4.7a15.077 15.077 0 0 1 8.383-5.144a12.843 12.843 0 0 1 2.538-.23l1.741-.05l.058 2.5c.032 1.373.1 6.334.16 11.025s-.251 8.259-.219 8.368c1.938-6.341 4.427-11.129 6.787-17.922l1.422-3.968h2.736c-.022.063-2.74 6.477-5.493 13.864l-5.452 13.5h-4.56c-.003-1.829-.443-11.212-.469-12.501Z"></path><path fill="#c8c8c8" d="M17.749 30h-5.087v-.314c0-1.13-.17-5.171-.306-8.418c-.082-1.949-.15-3.587-.16-4.074c-.152-6.317-.28-10.771-.332-12.038a11.753 11.753 0 0 0-1.786 1.009a7.264 7.264 0 0 0-2.439 3.163a8.076 8.076 0 0 0-.564 3.417a4.315 4.315 0 0 0 .182 1.844c.219.58.285.756.081.915c-.108.086-.123.1-.95 0c-2-.221-3.035-1.18-3.268-3.02a6.6 6.6 0 0 1 1.51-4.922A15.433 15.433 0 0 1 13.192 2.3a13.143 13.143 0 0 1 2.594-.242L17.844 2l.065 2.813c.032 1.387.105 6.437.161 11.029c.029 2.4-.039 4.537-.106 6.039c.9-2.616 1.878-5.014 2.9-7.519c1.039-2.536 2.113-5.159 3.16-8.173l1.5-4.179h3.4l-.15.42c0 .007-.031.077-.085.2a398.855 398.855 0 0 0-5.405 13.67Zm-4.461-.628h4.037L22.7 16.07a394.51 394.51 0 0 1 5.312-13.432h-2.045L24.62 6.4c-1.051 3.027-2.128 5.658-3.171 8.2c-1.306 3.189-2.54 6.2-3.611 9.706l-.3.993l-.3-1a3.121 3.121 0 0 1 .018-.854c.074-1.344.228-4.14.187-7.6c-.055-4.589-.129-9.637-.161-11.022l-.052-2.177l-1.43.041a12.667 12.667 0 0 0-2.471.226a14.78 14.78 0 0 0-8.2 5.027a6 6 0 0 0-1.388 4.469c.195 1.545 1.006 2.285 2.713 2.474l.249.027l-.037-.1a4.909 4.909 0 0 1-.221-2.066A8.707 8.707 0 0 1 7.053 9.1A7.9 7.9 0 0 1 9.7 5.66c.023-.016 2.256-1.555 2.674-1.132c.114.114.145.145.446 12.653c.01.485.078 2.116.16 4.059c.13 3.004.285 6.684.308 8.132Z"></path></svg></span>
                <span>{{ tr('创建收款') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {request} from '@/utils/request.js'
import {onBeforeMount, onMounted, reactive} from "vue";
import {tr} from "@/utils/common";
import tool from "@/utils/tool";
import {useRouter} from "vue-router";

const router = useRouter()
interface stateProps {
  infoData: {
    loginIp: string
    loginTime: string
    name: string
  },
  balance: {
    a: string,
    f: string,
    t: string
  },
  amountInfo: {
    a: string
    aa: string
    b: string
    bb: string
    c: string
    cc: string
  }
}

const state = reactive<stateProps>({
  infoData: {} as stateProps['infoData'],
  balance: {} as stateProps['balance'],
  amountInfo: {} as stateProps['amountInfo']
})

async function getInfo() {
  const res = await request({
    url: '/v1/index/info',
    method: 'get'
  })
  if (res.code === '200') {
    state.infoData = res.data;
  }
}

async function getBalance() {
  const res = await request({
    url: '/v1/index/balance',
    method: 'get'
  })
  if (res.code === '200') {
    state.balance = res.data;
  }
}

async function getIndex() {
  const res = await request({
    url: '/v1/index/',
    method: 'get'
  })
  if (res.code === '200') {
    state.amountInfo = res.data;
  }
}

function go2Path(path) {
  router.push(path)
}

onBeforeMount(() => {
  getInfo()
  getBalance()
  getIndex()
})
onMounted(() => {
  go2Path(tool.local.get('homePath'))
})
</script>
<style lang="less" scoped>
.home {
  height: 100%;

  .home__header {
    box-sizing: border-box;
    color: #000000d9;
    font-size: 14px;
    padding: 16px 24px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;

      .logo {
        height: 72px;
        width: 72px;
        border-radius: 100%;
      }

      .user-info {
        margin-left: 24px;

        .user-info__name {
          margin-bottom: 9px;
        }

        .user-info__message {
          color: #00000073
        }
      }
    }

    .right {
      display: flex;
      align-items: center;

      .right-item {
        margin-left: 64px;

        .item-title {
          color: #00000073;
        }

        .item-value {
          font-size: 24px;
        }

      }
    }
  }

  .home__body {

    .body-amount {
      display: flex;
      .card {
        flex: 1;
        &.router {
          max-width: 500px;
          margin-left: 0.75rem;
        }
      }
    }
  }
}

.card {
  background: #fff;
  border-radius: 2px;

  .card__header {
    min-height: 48px;
    margin-bottom: -1px;
    padding: 0 24px;
    color: #000000d9;
    font-weight: 500;
    font-size: 16px;
    background: transparent;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    display: flex;
    align-items: center;
  }

  .card__body {
    display: flex;
    align-items: center;
    .body-item {
      box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
      padding: 24px;
      color: rgba(0,0,0,.85);
      flex: 1;
      &:hover {
        box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
      }
      .item-header {
        font-size: 1.125rem;
        margin-left: 1rem;
        .header-title {
          display: inline-block;
          margin-bottom: 30px;
        }
      }
      .item-value {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 30px;
      }
      .item-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .item-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .anticon {
          margin-bottom: 10px;
        }
      }
    }
    &.card__grid__body {
      display: grid;
      grid-template-columns: repeat(3,  1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }


}
</style>