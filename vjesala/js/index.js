//inicijalizacija vrijednosti i funkcija
(function ($, window, undefined) {
    var pogreske = 0;
    var CC = 0;
    var C = 0;
    var S = 0;
    var Z = 0;
    var DJ = 0;
    var rand_broj = 0;
    var win = 0;
    var lose = 0;
    var tocno = 0;
    var resetiraj = 0;
    var postotak = 0;

    Hangman = {
        init: function (words) {
            this.words = words,
                this.hm = $(".hangman"),
                this.msg = $(".message"),
                this.msgTitle = $(".title"),
                this.msgText = $(".text"),
                this.restart = $(".restart"),
                this.wrd = this.randomWord(),
                this.correct = 0,
                this.guess = $(".guess"),
                this.wrong = $(".wrong"),
                this.wrongGuesses = [],
                this.rightGuesses = [],
                this.guessForm = $(".guessForm"),
                this.guessLetterInput = $(".guessLetter"),
                this.goodSound = new Audio("zvuk/goodbell.mp3"),
                this.badSound = new Audio("zvuk/bad.mp3"),
                this.winSound = new Audio("zvuk/win.mp3"),
                this.loseSound = new Audio("zvuk/lose.mp3"),
                this.setup();
        },


        setup: function () {
            this.binding();
            this.sounds();
            this.showGuess(this.wrongGuesses);
            this.showWrong();

        },

        //glasnoće zvuka
        sounds: function () {
            this.badSound.volume = .4;
            this.goodSound.volume = .4;
            this.winSound.volume = .8;
            this.loseSound.volume = .4;

        },

        //funkcija za gumbe
        binding: function () {
            this.guessForm.on("submit", $.proxy(this.theGuess, this));
            this.restart.on("click", $.proxy(this.theRestart, this));

        },

        //funkcija za puštanje gumba
        playSound: function (sound) {
            this.stopSound(sound);
            this[sound].play();
        },

        //funkcija za zaustavljanje zvuka
        stopSound: function (sound) {
            this[sound].pause();
            this[sound].currentTime = 0;

        },

        //funkcija resetiranje igre
        theRestart: function (e) {

            if (resetiraj == 0) {
                e.preventDefault();
                this.stopSound("winSound");
                this.stopSound("loseSound");
                pogreske = 0;
                document.hm.src = "hm0.png";
                win = 0;
                lose = 0;
                this.reset();
            }
            else { location.reload(); }
        },


        //funkcija pogađanja
        theGuess: function (e) {
            e.preventDefault();

            if (CC == 1) {
                var guess = "Č";
                CC = 0;
            } else if (C == 1) {
                var guess = "Ć";
                C = 0;
            } else if (S == 1) {
                var guess = "Š";
                S = 0;
            } else if (Z == 1) {
                var guess = "Ž";
                Z = 0;
            } else if (DJ == 1) {
                var guess = "Š";
                DJ = 0;
            } else {
                var guess = this.guessLetterInput.val().toUpperCase();
            }

            //dozvoljena slova
            if (guess.match(/[a-žA-Ž]/) && guess.length == 1) {


                //ako se ponovi isto slovo
                if ($.inArray(guess, this.wrongGuesses) > -1 || $.inArray(guess, this.rightGuesses) > -1) {
                    this.playSound("badSound");
                    this.guessLetterInput.val("").focus();

                } else if (guess) {
                    //ako se upiše več krivo uneseno slovo
                    var foundLetters = this.checkGuess(guess);
                    if (foundLetters.length > 0) {
                        this.setLetters(foundLetters);
                        this.playSound("goodSound");
                        this.guessLetterInput.val("").focus();
                    } else {
                        //ako se upiše pogrešno slovo
                        this.wrongGuesses.push(guess);
                        if (this.wrongGuesses.length == 5) {
                            this.lose();
                        } else {
                            this.showWrong(this.wrongGuesses);
                            this.playSound("badSound");
                            pogreske++;

                            document.hm.src = "hm" + pogreske + ".png";

                        }
                        this.guessLetterInput.val("").focus();
                    }
                }
            } else {
                this.guessLetterInput.val("").focus();
            }
        },
        //random riječ izaberi
        randomWord: function () {

            rand_broj = Math.floor(Math.random() * this.words.length);
            $("#hint").html(hintovi[rand_broj]);
            $("#slicica").attr("src", "slike/" + hintovi[rand_broj] + ".png");
            return this._wordData(this.words[rand_broj]);

        },


        showGuess: function () {
            var frag = "<ul class='word'>";
            $.each(this.wrd.letters, function (key, val) {
                frag += "<li data-pos='" + key + "' class='letter'>*</li>";
            });
            frag += "</ul>";
            this.guess.html(frag);
        },

        //krivo napisana slova
        showWrong: function (wrongGuesses) {
            if (wrongGuesses) {
                var frag = "<ul class='wrongLetters'>";
                frag += "<p>Pogrešna slova: </p>";
                $.each(wrongGuesses, function (key, val) {
                    frag += "<li>" + val + "</li>";
                });
                frag += "</ul>";
            } else {
                frag = "";
            }

            this.wrong.html(frag);
        },

        //pogođena slova
        checkGuess: function (guessedLetter) {
            var _ = this;
            var found = [];
            $.each(this.wrd.letters, function (key, val) {
                if (guessedLetter == val.letter.toUpperCase()) {
                    found.push(val);
                    _.rightGuesses.push(val.letter);
                }
            });
            return found;

        },


        setLetters: function (letters) {
            var _ = this;
            _.correct = _.correct += letters.length;
            $.each(letters, function (key, val) {
                var letter = $("li[data-pos=" + val.pos + "]");
                letter.html(val.letter);
                letter.addClass("correct");

                if (_.correct == _.wrd.letters.length) {
                    _.win();
                }
            });
        },


        _wordData: function (word) {

            return {
                letters: this._letters(word),
                word: word.toUpperCase(),
                totalLetters: word.length
            };
        },


        hideMsg: function () {
            this.msg.hide();
            this.msgTitle.hide();
            this.restart.hide();
            this.msgText.hide();
        },

        //pokaži porku
        showMsg: function () {

            var _ = this;
            _.msg.show("blind", function () {
                _.msgTitle.show("bounce", "slow", function () {
                    _.msgText.show("slide", function () {
                        _.restart.show("fade");
                    });

                });

            }, 4000);
        },


        reset: function () {
            this.hideMsg();
            this.init(this.words);
            this.hm.find(".guessLetter").focus();

        },


        _letters: function (word) {
            var letters = [];
            for (var i = 0; i < word.length; i++) {
                letters.push({
                    letter: word[i],
                    pos: i
                });
            }
            return letters;
        },


        rating: function () {
            var right = this.rightGuesses.length,
                wrong = this.wrongGuesses.length || 0,
                rating = {
                    rating: Math.floor((right / (wrong + right)) * 100),
                    guesses: (right + wrong)

                };
            return rating;
        },

        win: function () {
            win = 1;
            var rating = this.rating();
            tocno++;
            if (wordList.length == 32) {
                resetiraj = 1;
                postotak += rating.rating;
                this.msgTitle.html("Završili ste igru!");
                // this is messy
                this.msgText.html("Posljednja je riječ  pogođena u <span class='highlight'>" + rating.guesses + "</span> pokušaja.<br>Rezultat: <span class='highlight'>" + rating.rating + "%</span><br>Ukupni rezultat igre: <span class='highlight'>" + postotak / 10 + "%</span>");
                this.showMsg();
                this.playSound("winSound");
                hintovi.splice(rand_broj, 1);
                wordList.splice(rand_broj, 1);
                $("#gumb").html("Nova igra");
                lose = 1;
                wordList = ["feudalizam", "ALODIJ I RUSTIKAL", "SUSEDGRAD", "SUNČANI SAT", "SAMCI", "TLAKA", "GORNICA", "PUNTE", "AMBROZ GUBEC", "STUBIČKIH TOPLICA", "JOSIP ADAMČEK", "AUGUST ŠENOA", "HEGEDUŠIĆ", "MATIJI GUPCU", "MITNICE", "TRGOVIŠTA", "VITEŠKI TURNIR", "ZLATNOG KALEŽA"];
                hintovi = ["Društveno uređenje koje se temelji na lančanom odnosu podložnosti između vladara i vazala (vlastelina i njihovih podložnika) naziva se", "U feudalizmu, zemljišni posjed podijeljen je na osobni posjed vlastelina i zemljište koje obrađuju njegovi podložnici. Ti se posjedi nazivaju", "Franjo Tahy je u posjed dijela susedgradsko-stubičkog vlastelinstva došao kupnjom posjeda utvrde", "Prilikom arheoloških istraživanja na lokalitetu Stari ili Tahyjev grad u Donjoj Stubici otkriven je vrlo rijedak osobni predmet, džepni", "Muzej seljačkih buna nalazi se u dvorcu Oršić na mjestu nekadašnje utvrde", "Obveza kmetova na besplatan rad naziva se", "Među feudalnim podavanjima u naturi posebno se ističe vinska daća ili", "Seljačke bune nazivaju se još i", "Pravo ime vođe Velike seljačke bune 1573. bilo je", "Velika bitka u kojoj je poražena glavna ustanička vojska i kojom je završila Velika seljačka buna 1573. zbila se 9. veljače kod", "Od hrvatskih povjesničara Velikom seljačkom bunom najviše se bavio", "Za popularizaciju Velike seljačke bune 1573. najviše je zaslužan povijesni roman Seljačka buna čiji je autor", "U slikarstvu se temom Velike seljačke bune 1573. posebno intenzivno bavio slikar Krsto", "Puni naziv monumentalnog spomenika Velikoj seljačkoj buni autora Antuna Augustinčića je Spomenik Seljačkoj buni i", "Mjesta na kojima se naplaćivao prolaz robe nazivala su se", "Naselja čiji se stanovnici bave pretežito trgovinom i obrtom te imaju poseban pravni status zovu se", "Muzej seljačkih buna od 2001. organizira manifestaciju pod nazivom (...) u Gornjoj Stubici.", "Glavni organizator prikaza Velike seljačke bune 1573. „Seljačka buna 1573. – Bitka kod Stubice“ je Družba vitezova"];
                tocno = 0;
                Hangman.init(wordList);
            } else {
                hintovi.splice(rand_broj, 1);
                wordList.splice(rand_broj, 1);
                this.msgTitle.html("Čestitamo!");
                // this is messy
                this.msgText.html("Pogodili ste riječ u <span class='highlight'>" + rating.guesses + "</span> pokušaja.<br>Rezultat: <span class='highlight'>" + rating.rating + "%</span><br> Broj točno riješenih riječi: <span class='highlight'>" + tocno + "/" + 10 + "</span>");
                this.showMsg();
                this.playSound("winSound");
                postotak += rating.rating;

                $("#gumb").html("Nova riječ");
            }

        },


        lose: function () {

            lose = 1;
            resetiraj = 1;
            this.msgTitle.html("Izvisio si!<br><img src='hm6.png'><br>Riječ je bila: <span class='highlight'>" + this.wrd.word + "</span>");
            this.msgText.html("Broj točno riješenih riječi: <span class='highlight'>" + tocno + "/" + 10 + "</span>" + "<br>Ne uzrujavaj se i pokušaj ponovno.");
            this.showMsg();
            this.playSound("loseSound");
            wordList = ["feudalizam", "ALODIJ I RUSTIKAL", "SUSEDGRAD", "SUNČANI SAT", "SAMCI", "TLAKA", "GORNICA", "PUNTE", "AMBROZ GUBEC", "STUBIČKIH TOPLICA", "JOSIP ADAMČEK", "AUGUST ŠENOA", "HEGEDUŠIĆ", "MATIJI GUPCU", "MITNICE", "TRGOVIŠTA", "VITEŠKI TURNIR", "ZLATNOG KALEŽA"];
            hintovi = ["Društveno uređenje koje se temelji na lančanom odnosu podložnosti između vladara i vazala (vlastelina i njihovih podložnika) naziva se", "U feudalizmu, zemljišni posjed podijeljen je na osobni posjed vlastelina i zemljište koje obrađuju njegovi podložnici. Ti se posjedi nazivaju", "Franjo Tahy je u posjed dijela susedgradsko-stubičkog vlastelinstva došao kupnjom posjeda utvrde", "Prilikom arheoloških istraživanja na lokalitetu Stari ili Tahyjev grad u Donjoj Stubici otkriven je vrlo rijedak osobni predmet, džepni", "Muzej seljačkih buna nalazi se u dvorcu Oršić na mjestu nekadašnje utvrde", "Obveza kmetova na besplatan rad naziva se", "Među feudalnim podavanjima u naturi posebno se ističe vinska daća ili", "Seljačke bune nazivaju se još i", "Pravo ime vođe Velike seljačke bune 1573. bilo je", "Velika bitka u kojoj je poražena glavna ustanička vojska i kojom je završila Velika seljačka buna 1573. zbila se 9. veljače kod", "Od hrvatskih povjesničara Velikom seljačkom bunom najviše se bavio", "Za popularizaciju Velike seljačke bune 1573. najviše je zaslužan povijesni roman Seljačka buna čiji je autor", "U slikarstvu se temom Velike seljačke bune 1573. posebno intenzivno bavio slikar Krsto", "Puni naziv monumentalnog spomenika Velikoj seljačkoj buni autora Antuna Augustinčića je Spomenik Seljačkoj buni i", "Mjesta na kojima se naplaćivao prolaz robe nazivala su se", "Naselja čiji se stanovnici bave pretežito trgovinom i obrtom te imaju poseban pravni status zovu se", "Muzej seljačkih buna od 2001. organizira manifestaciju pod nazivom (...) u Gornjoj Stubici.", "Glavni organizator prikaza Velike seljačke bune 1573. „Seljačka buna 1573. – Bitka kod Stubice“ je Družba vitezova"];
            Hangman.init(wordList);
            $("#gumb").html("Nova igra");
            tocno = 0;
        }

    };
    var wordList = ["feudalizam", "ALODIJ I RUSTIKAL", "SUSEDGRAD", "SUNČANI SAT", "SAMCI", "TLAKA", "GORNICA", "PUNTE", "AMBROZ GUBEC", "STUBIČKIH TOPLICA", "JOSIP ADAMČEK", "AUGUST ŠENOA", "HEGEDUŠIĆ", "MATIJI GUPCU", "MITNICE", "TRGOVIŠTA", "VITEŠKI TURNIR", "ZLATNOG KALEŽA"];
    var hintovi = ["Društveno uređenje koje se temelji na lančanom odnosu podložnosti između vladara i vazala (vlastelina i njihovih podložnika) naziva se", "U feudalizmu, zemljišni posjed podijeljen je na osobni posjed vlastelina i zemljište koje obrađuju njegovi podložnici. Ti se posjedi nazivaju", "Franjo Tahy je u posjed dijela susedgradsko-stubičkog vlastelinstva došao kupnjom posjeda utvrde", "Prilikom arheoloških istraživanja na lokalitetu Stari ili Tahyjev grad u Donjoj Stubici otkriven je vrlo rijedak osobni predmet, džepni", "Muzej seljačkih buna nalazi se u dvorcu Oršić na mjestu nekadašnje utvrde", "Obveza kmetova na besplatan rad naziva se", "Među feudalnim podavanjima u naturi posebno se ističe vinska daća ili", "Seljačke bune nazivaju se još i", "Pravo ime vođe Velike seljačke bune 1573. bilo je", "Velika bitka u kojoj je poražena glavna ustanička vojska i kojom je završila Velika seljačka buna 1573. zbila se 9. veljače kod", "Od hrvatskih povjesničara Velikom seljačkom bunom najviše se bavio", "Za popularizaciju Velike seljačke bune 1573. najviše je zaslužan povijesni roman Seljačka buna čiji je autor", "U slikarstvu se temom Velike seljačke bune 1573. posebno intenzivno bavio slikar Krsto", "Puni naziv monumentalnog spomenika Velikoj seljačkoj buni autora Antuna Augustinčića je Spomenik Seljačkoj buni i", "Mjesta na kojima se naplaćivao prolaz robe nazivala su se", "Naselja čiji se stanovnici bave pretežito trgovinom i obrtom te imaju poseban pravni status zovu se", "Muzej seljačkih buna od 2001. organizira manifestaciju pod nazivom (...) u Gornjoj Stubici.", "Glavni organizator prikaza Velike seljačke bune 1573. „Seljačka buna 1573. – Bitka kod Stubice“ je Družba vitezova"];
    var duljina = wordList.length;

    Hangman.init(wordList);


    $("input").keyup(function (event) {

        $("form").submit();



    });

    $(document).ready(function () {
        $("#CC").click(function () { //č
            if (CC == 0) {
                CC = 1
                $("form").submit();
            } else {
                CC = 0
            };

        });


        $("#C").click(function () { //ć

            if (C == 0) {
                C = 1
                $("form").submit();
            } else {
                C = 0
            };

        });

        $("#S").click(function () { //š

            if (S == 0) {
                S = 1
                $("form").submit();
            } else {
                S = 0
            };

        });


        $("#DJ").click(function () { //đ

            if (DJ == 0) {
                DJ = 1
                $("form").submit();
            } else {
                DJ = 0
            };

        });



        $("#Z").click(function () { //ž

            if (Z == 0) {
                Z = 1
                $("form").submit();
            } else {
                Z = 0
            };

        });
    });

    $(document).keypress(function (e) {
        if (e.which == 13 && (win == 1 || lose == 1)) {
            $(".restart").trigger("click");
        }
    });


    var el = document.getElementById('slovo');

    el.focus();

    el.onblur = function () {
        setTimeout(function () {
            el.focus();
        });
    };

})(jQuery, window);