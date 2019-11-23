var kafka = require("kafka-node"),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);

var random = require('random')
let count = 0;

producer.on("ready", function() {
  console.log("ready");
  setInterval(function() {
   var message = {
        priority:random.int(min = 0, max = 10),
        message: `Message No ${count} `,
        timestamp: Date.now()
    }
    payloads = [
      { topic: "kafkapubsub", messages: JSON.stringify(message), partition: 0  }
    ];
    producer.send(payloads, function(err, data) { //publish information
      console.log(data);
      count += 1;
    });
  }, 50); //publish 20 message per second
});

producer.on("error", function(err) {
  console.log(err);
});