$(document).ready(function(){
    $.get('http://192.163.5.17:9000/api/get_lampadas', function(data,status){
        console.log(data);
        $('#dados').html($('#dados').html()+montaTela(data));
    });
    $(document).on('click', '.resposta', function(){
        $('.'+$(this).attr('id')+"-lampadas").toggleClass('d-none')
    });

    $(document).on('click', '.link-lampada', function(event){
        event.preventDefault()
        var url = $(this).attr('href')
        var idIcon = "#"+$(this).attr('id').replace('lampada','icon')
        var idLink = "#"+$(this).attr('id')
        
        console.log($(this).attr('id'))
        $.get(url,function(data,status){
            var estado = parseInt(data)
            $(idIcon).css('color', `${estado ? 'yellow' : 'black'}`)
            var hrefReplaced
            if(estado){
                hrefReplaced = url.replace('estado=1', 'estado=0')
            }else{
                hrefReplaced = url.replace('estado=0', 'estado=1')
            }
            console.log(hrefReplaced)
            $(idLink).attr('href', hrefReplaced)
        })
    });

    
    
});

function montaTela(data){
    var htmlText = ""
    data.forEach(comodo => {
        htmlText = htmlText + "<div class='row'> <div class='col-12'>"
        htmlText = htmlText + "<button type='button' class='btn btn-info resposta btn-block' id='"+comodo.nome.replace(/\s/g,'')+"'>"+comodo.nome+"</button>"
        htmlText = htmlText + "</div></div>"
        comodo.lampadas.forEach(lampada=>{
            htmlText = htmlText + `<div class='row'> <div class='col-12 ${comodo.nome.replace(/\s/g,'')}-lampadas d-none' >`
            htmlText = htmlText + `<a href='http://192.163.5.17:9000/api/update_lampada?endereco=
                    ${lampada.endereco}&${lampada.status ? 'estado=0' : 'estado=1'}' class='btn btn-secondary d-block link-lampada' id='lampada-${lampada.endereco}'
                        ><i class="material-icons" id='icon-${lampada.endereco}' style="color:${lampada.status ? 'yellow' : 'black'}"
                                >lightbulb_outline</i>${lampada.nome}</a>`
            htmlText = htmlText + "</div></div>"
        })
    });
    return htmlText
}

