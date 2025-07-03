(()=> {
    let yOffset = 0; //window.pageYOff 대신 쓸 변수=현재 스크롤 위치
    let prevScrollHeight = 0;//현재 스크롤위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0;//현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    
    const sceneInfo = [
        //scroll section 3개 
        {
            type: 'sticky',
            heightNum:3 ,//브라우저 높이의 3배로 scrollHeight 설정
            scrollHeight:0,
            objs: {//objs = html dom 객체 요소들.
                container : document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                //messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                //messageC: document.querySelector('#scroll-section-0 .main-message.c')
            },
            values: {
                messageA_opacity: [0,1],
                //messageB_opacity: [0,1],
                //messageC_opacity: [0,1]
            }
        },
        {
            //1번째 scroll section
            type:'sticky',
            heightNum:1,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                text: document.querySelector('#scroll-section-1 .scroll-text')  
        // 애니메이션할 텍스트 요소
            },
            values:{
                text_scale: [0.8, 1.5],

            }
        },
        {
            //2번째 scroll section
            type : 'normal',
            heightNum : 1,
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-2')
            }
        },
        
    ];
     //각 스크롤 섹션의 높이 세팅
    function setLayout() {

        let totalScrollHeight = 0; //전체 스크롤 높이값을 담을 변수
        for(let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            // scroll-section-n의 높이(=scrollHeight=섹션의 실제높이)를 heightNum * window.innerHeight(브라우저높이)로 설정함.
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`; //각 container의 height값을 업데이트        
            }
            console.log(sceneInfo);
            yOffset = window.pageYOffset; //현재 스크롤 위치값을 yOffset에 저장

            for(let i=0; i<sceneInfo.length; i++){
                totalScrollHeight += sceneInfo[i].scrollHeight;
                if(totalScrollHeight >= window.pageYOffset){
                    currentScene = i; //현재 활성화된 씬을 현재 스크롤 위치에 맞는 씬으로 설정
                    break;
                }
            }
             document.body.setAttribute('id', `show-scene-${currentScene}`);
            console.log("현재 body ID:", document.body.id);
    }
    function calcValues(values, currentYOffset){
        //values = Opacity값 0,1
        //currentYOffset=현재 씬에서 얼마나 스크롤 됐는지
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset/scrollHeight;
        rv=scrollRatio * (values[1] - values[0]) + values[0];
        return rv;// rv값을 매개변수로 나중에 playAnimation함수에서 가져감

    }
    //스크롤 이벤트를 발생시키기 위한 playAnimation함수
    function playAnimation(){
        if(currentScene >= sceneInfo.length) {
            console.warn(`currentScene(${currentScene}) 이 sceneInfo 배열의 길이를 초과함.`)
            return; //현재 씬이 sceneInfo의 길이보다 크면 함수 종료
        }
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset-prevScrollHeight;//현재 씬에서 얼마나 스크롤 됐는지(2번 씬일 때 약간 스크롤 됐을 경우 지금까지 화면에서 0번과 1번화면을 빼주고 계산을 시작함.)
        console.log(currentScene, currentYOffset);
        switch(currentScene) {
            case 0 :
                let messageA_opacity_in = calcValues(values.messageA_opacity,currentYOffset) //in은 0부터 시작하는 값이 들어온 것.
                //let messageB_opacity_in = calcValues(values.messageB_opacity,currentYOffset)
                //let messageC_opacity_in = calcValues(values.messageC_opacity,currentYOffset)

                objs.messageA.style.opacity = messageA_opacity_in; //messageA의 opacity값을 계산된 값으로 설정
                //objs.messageB.style.opacity = messageB_opacity_in; //messageB의 opacity값을 계산된 값으로 설정
                //objs.messageC.style.opacity = messageC_opacity_in; //messageC의 opacity값을 계산된 값으로 설정
                if(currentYOffset >= sceneInfo[currentScene].scrollHeight) {
                    //현재 씬의 스크롤 높이보다 현재 스크롤 위치가 크면  opacity 값을 0으로);
                    objs.messageA.style.opacity = 0;
                }
                break; //현재 씬의 스크롤 높이보다 현재 스크롤 위치가 크면 break;
                case 1 :
                    if(sceneInfo[0].objs.messageA){
                        sceneInfo[0].objs.messageA.style.opacity = 0; //첫번째 씬의 messageA opacity를 0으로 설정
                    }
                    //텍스트 스케일 계산
                    const textScale = calcValues(values.text_scale, currentYOffset);
                    //실실적용
                    objs.text.style.transform = `scale(${textScale})`;

                    break; //첫번째 씬의 스크롤 높이보다 현재 스크롤 위치가 크면 break;
                case 2:
                    break;
        }
    }

    //화면에 몇번쨰 스크롤 섹션이 스크롤 중인지를 판별하기 위한 함수
    function scrollLoop() {
        prevScrollHeight = 0; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
        for(let i = 0; i<currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
        }
        //currentScene이 마지막 인덱스(length-1)보다 작을 때만 ++(다음 씬이 존재할 때만 currentScene을 증가시킴)
        if( currentScene < sceneInfo.length - 1 && yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            //현재 스크롤 위치가 현재 씬의 스크롤 높이보다 크면 다음 씬으로 이동(스크롤 내리는 상황)
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if( yOffset < prevScrollHeight) {
            //현재 스크롤 위치가 현재 씬의 스크롤 높이보다 작으면 이전 씬으로 이동(스크롤 올리는 상황)
            if(currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        playAnimation();
    }
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset; //현재 스크롤 위치값을 yOffset에 저장
        scrollLoop(); //스크롤 이벤트 발생 시 scrollLoop 함수 실행
        playAnimation(); //스크롤 이벤트 발생 시 playAnimation 함수 실행
    })

   
     

     //다음 버튼 클릭
    // const slide = document.querySelector('.slide');
    // const leftBtn = document.querySelector('.left-btn');
    // const rightBtn = document.querySelector('.right-btn');

    // let currentslide = 1; //현재 슬라이드 위치
    // const totalSlides = document.querySelectorAll('.slide li').length;
    // const IMAGE_WIDTH = 800; // 각 이미지의 너비 (vw 단위로 가정)
    // function updateSlide() {
    // slide.style.transform = `translateX(-${currentIndex * 100}vw)`;
    // }

    // rightBtn.addEventListener('click', () => {
    // if (currentIndex < totalSlides - 1) {
    //     currentIndex++;
    //     updateSlide();
    // }
    // });

    // leftBtn.addEventListener('click', () => {
    // if (currentIndex > 0) {
    //     currentIndex--;
    //     updateSlide();
    // }
    // });
    // rightBtn.addEventListener('click',next);
    // function next(){
    //     console.log(currentslide);
    //     if(currentslide >=totalSlides){
    //         currentSlide =0;
    //         //이미지 슬라이드의 길이(이미지 장수)보다 커지지 않게.
    //     }
    //     slide.style.transform = `translateX(-${IMAGE_WIDTH * currentSlide}px)`;
    //     currentSlide++;
    // }
    // leftBtn.addEventListener('click',prev);
    // function prev(){
    //     if(currentSlide ===1){
    //         currentSlide = slideLength;
    //     }else {
    //         currentSlide--;
    //     }
    //     slide.style.transform = `translateX(=${IMAGE_WIDTH * (currentSlide -1)}px)`;
    // }
    /* 이미지 그리드 구현 */
    const images = [
    "img/kitten_1.jpg",
    "img/kitten_2.jpg",
    "img/kitten_3.jpg",
    "img/photo_1.jpg",
    "img/photo_2.jpg",
    "img/photo_3.jpg",
    "img/photo_4.jpg",
    "img/photo_5.jpg",
    "img/photo_6.jpg",
    "img/img1.jpg",
    "img/img2.jpg",
    "img/img3.png"
      ];
      /*페이지 만들기기*/ 
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
    let currentPage = 1;                              // 현재 보고 있는 페이지 (1부터 시작)
   const galleryItems = document.querySelectorAll(".gallery-item .img-wrapper img"); // .gallery-item img 요소들을 가져옴
   const galleryCaptions = document.querySelectorAll(".gallery-item .caption"); // .gallery-item .caption 요소들을 가져옴
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    function renderPage(page) {
        const startIndex = (page - 1) * ITEMS_PER_PAGE; // 예) page=1 → 0
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, images.length); // 예) page=1 ->start=0, endIndex=min(0+8,12) =8 (0~7번 채움)
    
    for(let i=0;i<ITEMS_PER_PAGE; i++){
        const globalIndex = startIndex + i; // 예) page=1, i=0 → globalIndex=0
        const imgElement = galleryItems[i];
        const captionElem = galleryCaptions[i];

        if(globalIndex <images.length){
            //images[globalIndex]가 존재한다면 src를 채우고 display:block으로 보여주기
            imgElement.src = images[globalIndex];
            //캡션 텍스트에 “파일 이름만” 뽑아서(마지막 슬래시 이후) 넣어 준다
            const fileName = images[globalIndex].split('/').pop();
            captionElem.textContent = fileName;
            imgElement.parentElement.style.display = "flex"; //이미지 요소의 부모 요소(.gallery-item <div>를 보여줌
            imgElement.closest(".gallery-item").style.display = "flex"; // .gallery-item <div>를 flex로 설정하여 이미지가 보이도록 함
        }
        else {
            //더이상 이미지가 없다면 빈 슬롯으로 만들기
            imgElement.src="";
            captionElem.textContent = "";
            imgElement.closest(".gallery-item").style.display = "none";
        }
    }
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = (currentPage ===1);
    nextBtn.disabled = (currentPage === totalPages);
}
    
nextBtn.addEventListener("click", () => {
    // currentPage가 마지막 페이지보다 작을 때만 다음 페이지로 이동
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});
    prevBtn.addEventListener("click", () => {
        if(currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById("toggle-menu").addEventListener("click", function () {
    // 사이드 메뉴 토글
    // 클릭 시 사이드 메뉴의 클래스를 토글하여 열고 닫기
    const menu = document.querySelector(".side-menu");
    menu.classList.toggle("closed");

        // 버튼 방향도 바꾸기
        if (menu.classList.contains("closed")) {
            this.textContent = "⮞";  // 펼치기
        } else {
            this.textContent = "⮜";  // 접기
        }
    });
    // const lbTargets = document.querySelectorAll(".lightbox-target");
    // const lightboxOverlay = document.getElementById("lightbox-overlay");
    // const lightboxImg = document.getElementById("lightbox-img");
    // const lightboxBack = document.getElementById("lightbox-back");

    // // 라이트박스 오버레이 클릭 시 닫기
    // lbTargets.forEach((imgElem) => {
    //   imgElem.addEventListener("click", function () {
    //     // 클릭된 이미지의 src 속성을 라이트박스 <img>에 복사
    //     lightboxImg.src = this.src;
    //     // 오버레이 보이기
    //     lightboxOverlay.style.display = "flex";
    //   });
    // });

    // // 돌아가기 버튼 클릭 시 main1.html로 이동
    // lightboxBack.addEventListener("click", function (e) {
    //   e.stopPropagation();            // 오버레이 닫히지 않도록 클릭 전파 막음
    //   window.location.href = "main1.html";
    // });

    window.addEventListener("load", () => {
    setLayout();
    renderPage(currentPage);
    });

    window.addEventListener('resize',setLayout); //윈도우창의 사이즈가 변할 때 setLayout도 실행을 함. =>height가 변함. 
})();