const TicketControl = require('../models/tickets-control');

const ticketControl = new TicketControl();


const socketController = (socket) => {

    //Cuando un cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit( 'estado-actual', ticketControl.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length );



    socket.on('siguiente-ticket', ( payload, callback ) => {
    
        const siguiente = ticketControl.siguiente();
        callback( siguiente );
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );

    })

    socket.on('atender-ticket', ({escritorio}, callback) => {

        if (!escritorio) {
            return callback ({
                ok: false,
                msg: 'El escritorio es Obligatorio'
            })
        }

        //TODO: Notificar cambio en los ultimos4
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length );
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length );


        
        const ticket = ticketControl.atenderTicket( escritorio )
        if (!ticket) {
            return callback ({
                ok: false,
                msg: 'ya no hay tickets pendientes'
            })
        } else {
            return callback ({
                ok: true,
                ticket
            }) 
        }
    })

}



module.exports = {
    socketController
}

