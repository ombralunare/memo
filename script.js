
    function getMemory( item )
    {
        let memory = localStorage.getItem("memory");

        if (!memory)
        {
            memory = {};
        }
        else
        {
            memory = JSON.parse( atob(memory) );
        };

        return ( item ? memory[item] : memory );
    };





    function setMemory( data )
    {
        let memory = getMemory();
        Object.assign(memory,data);

        memory = btoa( JSON.stringify(memory) );
        localStorage.setItem("memory", memory);

        return memory;
    };


   
    function ripMemory( item )
    {
        let memory = getMemory();
        delete memory[item];

        memory = btoa( JSON.stringify(memory) );
        localStorage.setItem("memory", memory);

        return memory;
    };





    function refresh( filter )
    {
        let viewCell = document.getElementById("viewCell");
        viewCell.innerHTML = "";
        let memory = getMemory();

        Object.keys(memory).forEach((item)=>
        {
            if (!!filter && !item.startsWith(filter)){ return };
            let card = document.createElement("card");

            card.title = item;
            card.innerHTML = // html text
            `<grid class="cardItemGrid">
                <grow>
                    <gcol class="cardTextCell">
                        ${item}
                    </gcol>
                    <gcol class="cardButnCell">
                        <button class="tossCard">
                            <i class="icon-cross"></i>
                        </button>
                    </gcol>
                </grow>
             </grid>`;

            let toss = card.getElementsByClassName("tossCard")[0];
            toss.target = item;

            toss.addEventListener("click", function()
            {
                ripMemory(this.target);
                refresh();
            });

            viewCell.appendChild(card);
        });
    };


    


    document.getElementById("cardButn").addEventListener("click", function()
    {
        let cardName = document.getElementById("cardName");
        let nameText = cardName.value.trim();

        if (nameText < 2)
        {
            alert("try again... invalid card name!");
            return;
        };

        let memory = getMemory();

        if ((typeof memory[ nameText ]) == "undefined")
        {
            setMemory({[nameText]:""});
            cardName.value = "";
            refresh();
            return;
        };

        refresh( nameText );
    });


    // to set Alarm
document.getElementById("loudButn").addEventListener("click", function setAlarm()
{   const alarm = getElementById("alarm")
    alarmDate = new Date = (date.value);
    now = new Date();

    let timeToAlarm = alarmDate - now;
    console.log(timeToAlarm);
    if (timeToAlarm =>0)
    {
        setTimeout((
        =>
        {
            playSong()
        }
        ));
        
    }


    let loudButn = getElementById("loudButn")
    let alarmTone = getElementById("alarmTone")
     
});



    refresh();


//to play Alarm   

var audioElement = new Audio(url);  // creates audio element for alarm //
audioElement.createEventListener('loadeddata', ()=>
    {
        audioElement.play()
        let duration = audioElement.duration;   // 'duration' = song duration
    }                                           // create "click" func for Alarm (loudButn)
);

//function(playSong)
//{
  //  audioElement.play();
//}


// not sure where this goes yet: 
//  mediaElement.load();



