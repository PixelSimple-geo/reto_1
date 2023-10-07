setInterval(() => {
    getData().then(()=> {
        turnLightOn(h1);
        checkBoxAutoMan.checked = select_auto_man;
        incrementStopCount(cycle[mem_posizioa]);

        if (seta) { // State: train is stopped
            setButtonsState(false, true,false, true);
            if (rearme) { // State: train is returning to its origin
                setButtonsState(true, true, true,true);
                train.style.transition = "all 2000ms";
                train.style.left = cycle[0];
                postData(["SETA", false], ["REARME", false]);
            }
        } else if (select_auto_man) { // State: train is on automatic mode
            if (pm) { // State: train is running
                setButtonsState(true,false,true, false);
                if (pfc === true && mem_posizioa === 1) {
                    train.style.left = cycle[1];
                    setTimeout(() => {
                        train.style.left = cycle[0];
                        postData(["PFC", false], ["PM", false], ["MEM_POSIZIOA", 0]);
                    }, 2000);
                } else {
                    train.style.transition = "all 1000ms";
                    playNextAnimation(cycle, mem_posizioa);
                }
            } else { // State: train is not running
                setButtonsState(false,true,true,true);
                train.style.transition = "all 1000ms";
                train.style.left = cycle[0];
            }
        } else { // State: train is on manual mode
            setButtonsState(false,true,true,true);
            train.style.transition = "all 1000ms";
            playNextAnimation(cycle, mem_posizioa);
            if (pm) {
                postData(["PM", false]);
            }
        }

        if (mem_posizioa === 0 && busqueda0) postData(["BUSQUEDA_0", false]);

    }).catch(error => {showErrorDialog("Fetch error: " + error)})

}, 500);