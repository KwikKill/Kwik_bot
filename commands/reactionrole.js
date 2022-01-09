module.exports = {
    name: 'reactionrole',
    group: 'moderation',
	  description: "Commande de déploiement du message de reaction",
	  permission: "owner",
    hidden: false,
    serverid: ["513776796211085342", "890915473363980308"],
    help: [
        {
            "name": "- __reactionrole__ :",
            "value": "Envoie le message de réaction."
          }
    ],
	  place: "guild",
    options: undefined,
    async run(message, client, interaction=undefined, mssg=true) {
      if(interaction != undefined) {
        console.log("a") 
      }
    }
}
