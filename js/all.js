
let data = [];

//用 axios 撈 JSON 資料
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {

        addData(response);

    });

//選單區宣告
const formList = document.querySelector('#formList');
const ticketName = document.querySelector('#ticketName');
const imgUrl = document.querySelector('#imgUrl');
const area = document.querySelector('#area');
const price = document.querySelector('#price');
const num = document.querySelector('#num');
const star = document.querySelector('#star');
const introduce = document.querySelector('#introduce');
const submitBtn = document.querySelector('.btn');

//選取表單全部
const formNull = document.querySelectorAll('#formList input[type="text"],#formList input[type="number"],#formList select,#formList textarea');

//下拉式塞選選單宣告
const searchArea = document.querySelector('#searchArea');
const searchNum = document.querySelector('#searchNum');

//套票顯示區宣告
let travelList = document.querySelector('.travelCardList');


function renderTicket(item){
    
    let str = `<li class="col-md-6 col-lg-4">
        <a class="travelCard" href="#">
            <div class="travelCard-header">
                <p class="locationText">${item.area}</p>
                <img class="travelImg" src="${item.imgUrl}" alt="${item.name}">
                <p class="groupScore">${item.rate.toFixed(1)}</p>
            </div>
            <div class="travelCard-body">
                <h3 class="travelCard-title">${item.name}</h3>
                <p class="travelCard-text">
                    ${item.description}
                </p>
                <div class="travelCard-footer">
                    <p>
                        <span class="material-icons">
                            error
                        </span>
                        剩下最後 <span id="groupNum">${item.group}</span> 組
                    </p>
                    <p>TWD<span class="groupPrice">$${item.price}</span></p>
                </div>
            </div>
        </a>
    </li>`

    return str;
}

//顯示全部旅遊套票
function showALL(){

    let ticket = "";
    let count = 0;

    data.forEach(function(item){
        count ++;
        ticket += renderTicket(item);
    })
    
    searchNum.textContent = count;
    travelList.innerHTML = ticket;

}

//顯示篩選過的旅遊套票
function showSelect(mode){

    let ticket = "";
    let count = 0;

    data.forEach(function(item){
        if(item.area == mode){
            count ++;
            ticket += renderTicket(item);
        }
    })

    searchNum.textContent = count;
    travelList.innerHTML = ticket;

}

//按資料送出時表格防呆判斷
function proofreading(){

     //判斷是否有表單空值
    let whetherNull = false;
    formNull.forEach(function(item){

        if(item.value == ""){
            item.classList.add('error');
            whetherNull = true;
        }else{
            item.classList.remove('error');
        }
         
    })

    if(whetherNull){
        alert("有未填寫表格!!");
    }
    return whetherNull;
}

//星級填寫是否超過規範
function starCheck(){

    let starExceed = false;
    if(star.value < 0 || star.value > 10){
        starExceed = true;
        star.classList.add('error');
        alert("星級輸入超過範圍值");
    }else{
        star.classList.remove('error');
    }

    return starExceed;
}

//套票組數是否大於0
function groupNumCheck(){

    let groupNnusual = false; 

    if(num.value < 1){
        groupNnusual = true;
        num.classList.add('error');
        alert("套票組數小於1張，請在確認!!");
    }else{
        num.classList.remove('error');
    }

    return groupNnusual;
}

//價格是否正常
function priceCheck(){

    let priceNnusual = false;
    if(price.value < 0){
        price.classList.add('error');
        alert("套票價格為負數，請重填!!")
        priceNnusual = true;
    }else{
        price.classList.remove('error');
    }
    return priceNnusual;

}


//輸入和點擊input就檢查--------------------

formNull.forEach(function(item){

    item.addEventListener('blur',function(e){
        //blur 當離開焦點時觸發
        
        if(item.value != ""){
            item.classList.remove('error');
        }else{
            item.classList.add('error');
        }

    })
    
})

//輸入和點擊input就檢查結束--------------------


//初始畫面(用 axios 撈外部 JSON 資料)
function addData(response){
    data = response.data.data;
    showALL();
}

//新增旅遊套票
submitBtn.addEventListener('click',function(e){

    //停止預設動作
    e.preventDefault;

    //接收function回傳的防呆布林值
    let checkNull = proofreading(); //是否有空值
    let checkStar = false;          //星級是否超過範圍
    let checkGroup = false;         //套票數是否小於1張
    let checkPrice = false;         //價格是否為負數

    if(checkNull == false){
        //先確定沒有空值在檢查星級範圍、套票數、價格是否正常
        checkStar = starCheck();
        checkGroup = groupNumCheck();
        checkPrice = priceCheck();
    }

    //檢查條件都false才能新增
    if(checkNull == false && checkStar == false && checkGroup == false && checkPrice == false){
        data.push({
            id : data.length,
            name : ticketName.value,
            imgUrl : imgUrl.value,
            area : area.value,
            description : introduce.value,
            group : Number(num.value),
            price : Number(price.value),
            rate : Number(star.value)
        })
    
        showALL();
        alert("新增成功!");
        formList.reset(); //新增後清除表單裡的資料
        searchArea.value = "全部地區";
    }
   
   
})


//篩選旅遊套票
searchArea.addEventListener('click',function(e){
    
    if(e.target.value == "全部地區"){

        showALL();

    }else if(e.target.value == "台北"){
        
        showSelect("台北");

    }else if(e.target.value == "台中"){

        showSelect("台中");
        
    }else if(e.target.value == "高雄"){

        showSelect("高雄");
        
    }

})

