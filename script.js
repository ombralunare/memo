
    function getMemory( item )
    {
        let memory = ( localStorage.getItem("memory") || btoa("[]") );
            memory = JSON.parse( atob(memory) );

        return ( isNaN(item) ? memory : memory[item] );
    };





    function setMemory( data, indx)
    {

        let memory = getMemory();
        indx = (indx || memory.length);
        memory[indx] = data;
        memory = btoa( JSON.stringify(memory) );
        localStorage.setItem("memory", memory);

        return getMemory();
    };



    function ripMemory( indx )
    {
        let memory = getMemory();
        let result = [];

        memory.forEach((obj,idx)=>
        {
            if (idx === indx){ return };
            result.push(obj);
        });

        memory = btoa( JSON.stringify(result) );
        localStorage.setItem("memory", memory);

        return getMemory();
    };





    function parlay( card )
    {
        let layr = document.createElement("layer");
        layr.innerHTML = document.getElementById("confTemplate").innerHTML;
        let form = layr.getElementsByTagName("form")[0];
        let kids = [].slice.call(form.children);
        let conf = card.config;
        let dump = form.getElementsByClassName("dump")[0];
        let save = form.getElementsByClassName("save")[0];
        let bond = {parent:card, config:form, parlay:layr};

        kids.forEach((node)=>
        {
            let name = node.name;
            if (!name){ return };
            node.value = conf[name];
        });

        form.onsubmit = function(event)
        {
            event.preventDefault();
        };

        dump.onclick = function()
        {
            ripMemory(this.parent.target);
            this.parlay.parentNode.removeChild(this.parlay);
            refresh();
        }
        .bind(bond);

        save.onclick = function()
        {
            let config = {};
            Object.keys(this.parent.config).forEach((key)=>
            {
                let val = this.config[key].value;
                config[key] = val;
            });
            setMemory(config, this.parent.target);
            this.parlay.parentNode.removeChild(this.parlay);
            refresh();
        }
        .bind(bond);

        document.body.appendChild(layr);
    }





    function refresh( filter )
    {
        let viewCell = document.getElementById("viewCell");
        viewCell.innerHTML = "";
        let memory = getMemory();

        memory.forEach((obj,idx)=>
        {
            if (!obj || (!!filter && !item.startsWith(filter))){ return };
            let card = document.createElement("card");

            card.title = obj.name;
            card.target = idx;
            card.config = obj;
            card.innerHTML = document.getElementById("cardTemplate").innerHTML;
            card.getElementsByClassName("cardTextCell")[0].innerHTML = obj.name;

            card.addEventListener("click", function()
            {
                parlay(this);
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

        setMemory
        ({
            name: nameText,
            desc: "",
            date: "",
            time: "",
            days: "0123456",
            play: "/sounds/hellcat.opus",
            seek: "",
            loud: 1,
            loop: true,
            live: true,
        });

        cardName.value = "";
        refresh();
    });




    window.alarm = function alarm(conf)
    {
        let resl = new Audio(conf.play);
        resl.loop = conf.loop;
        resl.layer = document.createElement("layer");
        resl.layer.audio = resl;

        resl.layer.innerHTML = document.getElementById("alarmTemplate").innerHTML;
        resl.layer.getElementsByClassName("alarmFace")[0].innerHTML = conf.name;
        resl.layer.addEventListener("click", function()
        {
            this.audio.pause();
        });

        document.body.appendChild(resl.layer);

        resl.addEventListener("canplay", function()
        {
            this.parlay = document.createElement("layer");
            this.parlay.audio = this;
            this.play();
        });

        resl.addEventListener("pause", function()
        {
            this.layer.parentNode.removeChild(this.layer);
        });

        return resl;
    }




    setInterval(function check()
    {
        let data = getMemory();
        let date = new Date();
        let zone = (date.getTimezoneOffset() * -1);
        let time = (Math.floor(date.getTime() / 1000) + (zone * 60));
        let cDay = (date.getDay()+"");

        data.forEach((conf,indx)=>
        {
            if (!conf || !conf.time){ return }; // invalid card conf .. can't use this, yet.

            let confDate = (!conf.date ? date : new Date(conf.date));
            let timeText = (confDate.toISOString().split("T")[0] + "T" + conf.time + ":00.000Z");
            let confTime = Math.floor((new Date(timeText).getTime()) / 1000);
            let timeDiff = (confTime - time);

            if (timeDiff === 0){ alarm(conf) }; // now now now!
        });


    },1000);


    refresh();

    document.getElementById("welcome").addEventListener("click", function()
    {
        this.parentNode.parentNode.removeChild(this.parentNode);
    });
