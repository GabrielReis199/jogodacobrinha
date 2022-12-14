$(document).ready(function() {

    var cor1 = "#acadff"
    var cor2 = "#aa7efc"
    var cor3 = "#340442"
    var cor4 = "#12381b"
    var cor5 = "#FFB323"
    var cor6 = "#7f5ac5"

    
    var clock = 0 // velocidade da cobrinha

    var linhas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
    //             1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16

    var tamanhoCobra = [{linha: 8, coluna: 2}, 
                        {linha: 8, coluna: 3}, 
                        {linha: 8, coluna: 4}]

    var cimaBaixo = 8 // negativo vai pra cima // positivo vai pra baixo
    var esquerdaDireita = 4 // negativo vai pra esquerda // positivo vai pra direita
    var direcaoCBED = 4 // 1:cima 2:baixo 3:esquerda 4:direita

    var comidaAtual = [] // coordenada da comida

    var tamanhoCobraZero = [{linha:8, coluna: 2}] // última posicao da cobra

    converteLinhas = function (posicaoLetra) { // transformar a posição de int para string
        return linhas[posicaoLetra-1]
    }

    rodaRandom = function() { // gera uma comida leatória no mapa
        if(tamanhoCobra.length==256) {
            $("#gameOver").show()
            $("#itensGameOver p:nth-child(1)").html("Você ganhou! Parabéns!")
            $("header span").css("pointer-events", "none")
            controleJogo.pause()
        }
        var auxLinha = Math.floor(Math.random() * 15) + 1
        var auxColuna = Math.floor(Math.random() * 15) + 1
        for(var i=0; i<tamanhoCobra.length-1; i++) {
            if(tamanhoCobra[i].linha==auxLinha && tamanhoCobra[i].coluna==auxColuna) {
                auxLinha = Math.floor(Math.random() * 15) + 1
                auxColuna = Math.floor(Math.random() * 15) + 1
                i=-1
            }
        }
        comidaAtual[0] = auxLinha
        comidaAtual[1] = auxColuna
    }
    rodaRandom()

    imprimeComida = function() { // imprime a comida na tela
        $("tr td[class|="+converteLinhas(comidaAtual[0])+comidaAtual[1]+"]").css("background-color", cor5)
    }
    imprimeComida()

    imprimeFundo = function () { // imprime o quadriculado de fundo + comida
        $("tr td").each(function() {
            $(this).css("background-color", cor6)
            $("tr:nth-child(2n) td:nth-child(2n)").css("background-color", cor2)
            $("tr:nth-child(2n+1) td:nth-child(2n+1)").css("background-color", cor2)
            imprimeComida()
        })
    }

    imprimeCobra = function() { // imprime a cobra na tela
        for(var i=0; i<tamanhoCobra.length; i++) {
            if($("tr td").hasClass(converteLinhas(tamanhoCobra[i].linha)+tamanhoCobra[i].coluna)) {
                $("tr td[class|="+converteLinhas(tamanhoCobra[i].linha)+tamanhoCobra[i].coluna+"]").css("background-color", cor4)
            }
        }
    }

    moveCobra = async function(direcaoCBED) { // atualiza o vetor para a cobra se movimentar
        tamanhoCobraZero = tamanhoCobra[0]
        console.log(clock)
        var auxTamanhoCobra = tamanhoCobra.slice(0,tamanhoCobra.length-1)
        for(var i=0; i<auxTamanhoCobra.length-1; i++) { // verifica se a cobra bateu nela mesma
            if(auxTamanhoCobra[i].linha==tamanhoCobra[tamanhoCobra.length-1].linha && 
               auxTamanhoCobra[i].coluna==tamanhoCobra[tamanhoCobra.length-1].coluna) {
                $("#gameOver").show()
                controleJogo.pause()
            }
        }
        if(cimaBaixo!=0 && cimaBaixo!=17 && esquerdaDireita!=0 && esquerdaDireita!=17) { // verifica se bateu na parede
            // come a comida, aumenta o tamanho e coloca uma nova comida aleatória
            if( tamanhoCobra[tamanhoCobra.length-1].linha==comidaAtual[0] &&
                tamanhoCobra[tamanhoCobra.length-1].coluna==comidaAtual[1] ) { 
                tamanhoCobra.unshift({linha: tamanhoCobraZero.linha, coluna: tamanhoCobraZero.coluna})
                rodaRandom()
            }
            // faz a cobra se mover dependendo da direção
            if(direcaoCBED==1) {
                cimaBaixo--
                tamanhoCobra.shift()
                tamanhoCobra.push({linha: cimaBaixo, coluna: tamanhoCobra[tamanhoCobra.length-1].coluna})
            } else if(direcaoCBED==2) {
                cimaBaixo++
                tamanhoCobra.shift()
                tamanhoCobra.push({linha: cimaBaixo, coluna: tamanhoCobra[tamanhoCobra.length-1].coluna})
            } else if(direcaoCBED==3) {
                esquerdaDireita--
                tamanhoCobra.shift()
                tamanhoCobra.push({linha: tamanhoCobra[tamanhoCobra.length-1].linha, coluna: esquerdaDireita})
            } else if(direcaoCBED==4) {
                esquerdaDireita++
                tamanhoCobra.shift()
                tamanhoCobra.push({linha: tamanhoCobra[tamanhoCobra.length-1].linha, coluna: esquerdaDireita})    
            }
        } else {
            $("#gameOver").show()
            $("header span").css("pointer-events", "none")
            controleJogo.pause()
        }
        imprimeCobra() // após cada movimento, imprime a cobra pra atualizar na tela
    }

    resetaCobra = function() {
        tamanhoCobra = [{linha: 8, coluna: 2}, 
            {linha: 8, coluna: 3}, 
            {linha: 8, coluna: 4}]
        cimaBaixo = 8
        esquerdaDireita = 4
        direcaoCBED = 4
    }

    setaClock = function(dificuldade) {
        if(dificuldade==1)
            localStorage.nivel = 1000
        else if(dificuldade==2)
            localStorage.nivel = 500
        else if(dificuldade==3)
            localStorage.nivel = 300
        clock = localStorage.nivel
    }

    desabilitaBotao = function(booleano) { // 1 = desliga cimabaixo | 0 = desliga esquerdadireita
        if(booleano) {
            $("#cima").css('pointer-events', 'none')
            $("#baixo").css('pointer-events', 'none')
            $("#esquerda").css('pointer-events', 'auto')
            $("#direita").css('pointer-events', 'auto')
        } else {
            $("#cima").css('pointer-events', 'auto')
            $("#baixo").css('pointer-events', 'auto')
            $("#esquerda").css('pointer-events', 'none')
            $("#direita").css('pointer-events', 'none')
        }
        
    }
    
    var controleJogo = { // permite que o jogo fique "rodando", podenso pausar e dar play
        loopControle: null,
        loop: function(){
            this.loopControle = setInterval(function() {
                imprimeFundo()
                moveCobra(direcaoCBED)
            }, clock)
        },
        play: function() {
            this.loop()
        },
        pause: function() {
            clearInterval(this.loopControle)
        }
    }
    controleJogo.pause()

    $(document).keydown(function(e){ // verifica os botões apertados
        if( (e.key == "w" || e.key == "ArrowUp") && direcaoCBED != 2 && direcaoCBED != 1 ){
            $("#cima").click()
        } else if( (e.key == "s" || e.key == "ArrowDown") && direcaoCBED != 1 && direcaoCBED != 2 ){
            $("#baixo").click()
        } else if( (e.key == "a" || e.key == "ArrowLeft") && direcaoCBED != 4 && direcaoCBED != 3 ){
            $("#esquerda").click()
        } else if( (e.key == "d" || e.key == "ArrowRight") && direcaoCBED != 3 && direcaoCBED != 4){
            $("#direita").click()
        }
    })

    $("#cima").click(async function() {
        controleJogo.pause()
        direcaoCBED=1
        await imprimeFundo()
        await moveCobra(direcaoCBED)
        controleJogo.play()
        desabilitaBotao(true)
    })

    $("#baixo").click(async function() {
        controleJogo.pause()
        direcaoCBED=2
        await imprimeFundo()
        await moveCobra(direcaoCBED)
        controleJogo.play()
        desabilitaBotao(true)
    })

    $("#esquerda").css('pointer-events', 'none')
    $("#esquerda").click(async function() {
        controleJogo.pause()
        direcaoCBED=3
        await imprimeFundo()
        await moveCobra(direcaoCBED)
        controleJogo.play()
        desabilitaBotao(false)
    })

    $("#direita").click(async function() {
        controleJogo.pause()
        direcaoCBED=4
        await imprimeFundo()
        await moveCobra(direcaoCBED)
        controleJogo.play()
        desabilitaBotao(false)
    })

    $("#gameOver").hide()
    $("#gameOver span").click(function() { // reseta o game, caso perca
        $("header span").css("pointer-events", "auto")
        $("#itensGameOver p:nth-child(1)").html("Você perdeu!")
        $("#gameOver").hide()
        resetaCobra()
        clock = localStorage.nivel
        desabilitaBotao(false)
        rodaRandom()
        controleJogo.play()
    })

    $("#cima").css('pointer-events', 'none')
    $("#baixo").css('pointer-events', 'none')
    $("#esquerda").css('pointer-events', 'none')
    $("#direita").css('pointer-events', 'none')

    $("header span").css("pointer-events", "none")
    $("body").on("click", "input[type='submit']", function(e) { // pega a informacão do form
        e.preventDefault()
        $("header span").css("pointer-events", "auto")
        var dificuldade = $("input[name=nivel]").val()
        setaClock(dificuldade)
        desabilitaBotao(false)
        controleJogo.play()
        $("#formConfig").slideToggle(200)
        
    })

    $("header span").click(function() { // faz esconder as configuracoes da partida
        $("#formConfig").slideToggle(200)
        $("#formConfig span").show(200)
        controleJogo.pause()
        $("header span").css("pointer-events", "none")
        $("input[type='submit']").attr("value", "Continuar Jogo")
    })

    $("#formConfig span").css("display", "none")
    $("#formConfig span").click(function() { // faz esconder as configuracoes da partida
        $("#formConfig").slideToggle(200)
        $("header span").css("pointer-events", "auto")
        resetaCobra()
        var dificuldade = $("input[name=nivel]").val()
        setaClock(dificuldade)
        desabilitaBotao(false)
        rodaRandom()
        controleJogo.play()
    })

})