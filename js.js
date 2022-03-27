const $ =document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')




const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    // config: JSON.stringify(localStorage.getItem(PLAYER_STORAGE_KEY)||{}),
    // setConfig:function(key,value){
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY,this.config)
    // },
    songs:[
    {
        name:'So Close',
        singer:'Phương Ly',
        path:'./assets/music/soclose.mp3',
        image:'./assets/image/img1.jpg'
    },
    {
        name:'Lạc Trôi',
        singer:'Sơn Tùng',
        path:'./assets/music/lactroi.mp3',
        image:'./assets/image/img2.jpg'
    },
    {
        name:'Như ngày hôm qua',
        singer:'Sơn Tường',
        path:'./assets/music/nhungayhomqua.mp3',
        image:'./assets/image/img5.jpg'
    },
    {
        name:'Cua',
        singer:'Hieu thu ba',
        path:'./assets/music/cua.mp3',
        image:'./assets/image/img3.jpg'
    },
    {
        name:'Chuyện tình tui',
        singer:'Kay Trần',
        path:'./assets/music/chuyentinhtoi.mp3',
        image:'./assets/image/img4.jpg'
    },
    {
        name:'GoodBoy',
        singer:'G-Ducky',
        path:'./assets/music/GoodBoy.mp3',
        image:'./assets/image/img6.jpg'
    },
    {
        name:'Tam Giác',
        singer:'Anh Phan',
        path:'./assets/music/tamgiac.mp3',
        image:'./assets/image/img7.jpg'
    },
    {
        name:'Quan tài hư',
        singer:'Ngài Mr.Quang Tèo',
        path:'./assets/music/quantaihu.mp3',
        image:'./assets/image/img8.jpg'
    },
    
    
    ],
    setConfig: function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },


    render:function(){
        const htmls = this.songs.map((song ,index)=>{
            return `
                <div class="song ${index === this.currentIndex ?'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')

    },
    // Định nghĩa lại cái object để dùng 
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }  
        })

    },

    // XỬ LÝ SỰ KIỆN
    handlerEvent:function(){
        // XỬ lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
            duration:10000,
            // Infinity la vo han
            interations:Infinity

        })
        cdThumbAnimate.pause();
            //Lay cai class CD ra 
            const _this = this;
            // Lấy cái offsetWidth của nó ra
            const cdWidth = cd.offsetWidth; 
        // Xử lý phóng to / thu nhỏ CD 
        // cái document này để đại diện cho tất cả thằng tài liệu của cái trang 
        // onscroll để kéo nguyên cái document
        document.onscroll = function(){
            // Một số trình duyệt scrollY không thể hoạt động nên thêm vào 
            // documentElement là cái element của HTML 

            const scrollTop =  window.scrollY|| document.documentElement.scrollTop

            // Lấy cái cdWidth - scroolTop để giảm cái Width của thằng cd xuống
            const newCdWidth = cdWidth - scrollTop
            // cd.style.width = newCdWidth + "px" này xài nó nhỏ lại được mà không mất vì nó bị đưa vào giá trị âm nên nó không + lên được nữa;
            // Nên sử dụng thằng này
            // sử dụng toán tử so sánh 3 ngôi cho nhanh
            // nếu nó lớn hơn 0 thì lấy thằng newCdWidth + px và ngược lại lấy giá trị 0
            cd.style.width = newCdWidth >0 ? newCdWidth + "px" : 0;
        
            cd.style.opacity = newCdWidth / cdWidth
        }   

        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause(); 
            }else{
                audio.play();
            }
        }
        // Khi song được play thì lắng nghe
        audio.onplay =function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause =function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/audio.duration*100);
                progress.value = progressPercent;
                
            }
        }
        // XỬ lý khi tua song
        progress.oninput = function(e){
           
            const seekTime = audio.duration / 100 *e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bai Song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }

            // _this.nextSong()
            audio.play();
            _this.render()
            _this.scrollToActiveSong();
        }
        // Khi prev SOng
        preBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            // _this.prevSong()
            audio.play();
            _this.scrollToActiveSong();

        }

        // Lang nghe thang Random
        // Xử lý bật tắt nút random
        randomBtn.onclick = function(e){
            // ! not chính nó nó đảo ngược lại
            _this.isRandom = !_this.isRandom
            // _this.setConfig('isRandom',_this.isRandom)
            // Toggle để dùng chuyển đổi giữa thêm và xoá tên class ra khỏi element
            // Nó nhận 2 đối số nếu đối số thứ 2 boolen là true thì nó thêm , sai thì nó xáo
            randomBtn.classList.toggle('active',_this.isRandom)

        }

        // Xử lý phát lập lại một bài hát 
        repeatBtn.onclick =function(e){
            _this.isRepeat = !_this.isRepeat 
            
            // _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
            
        }


        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
                
            }else{
                nextBtn.click();
            }
            
        }
        // Lắng nghe vào playlist
        playlist.onclick = function (e) {
            const songNode =e.target.closest('.song:not(.active)')
            // target la cai dich ma chung ta nham vao`
            if(songNode || e.target.closest('.option')){
                // Xu ly khi click vao song
                if(songNode){
                    // Viet kieu nay duoc ma` no bi sang kieu chuoi~ nen phai convert no ve NUmber
                    // _this.currentIndex = (songNode.dataset.index)
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // XU ly khi click vao option
                if(e.target.closest('.option')){
                    // Muon xu ly gi thi xu ly
                }

            }
        }   

    },

    scrollToActiveSong:function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                hehavior:'smooth',
                block:'center'
            })
        },300)
    },



    loadCurrentSong:function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage =`url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        

    },

    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
       
        this.loadCurrentSong()
        
    },
    prevSong:function(){
        this.currentIndex--;
        if(this.currentIndex <0 ){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong()
        console.log(this.songs.length-1)
    },

    playRandomSong:function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
            
        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },


    start:function(){
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Gọi handlerEvent ra để xử lý sự kiên và để chạy được nó (DOM EVENT)
        this.handlerEvent();
        
        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Gọi render ra để chạy được thằng render playlist
        this.render();
       
        
        
        }
    

    
}

    app.start();


    

