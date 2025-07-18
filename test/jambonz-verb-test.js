const test = require('tape');
const logger = require('pino')({level: process.env.JAMBONES_LOGLEVEL || 'error'});
const { validate } = require('..');

test("validate correct verbs", async (t) => {

  verbs = [
    {
      "verb": "play",
      "url": "https://example.com/example.mp3",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    },
    {
      "verb": "conference",
      "name": "test",
      "beep": true,
      "startConferenceOnEnter": false,
      "waitHook": "/confWait",
      "enterHook": "/confEnter"   
    },
    {
      "verb": "config",
      "synthesizer": {
        "voice": "Jenny",
        "vendor": "google",
        "label": "label1"
      },
      "recognizer": {
        "vendor": "google",
        "language": "de-DE",
        "label": "label1"
      },
      "bargeIn": {
        "enable": true,
        "input" : ["speech"],
        "actionHook": "/userInput"
      },
      "transcribe": {
        "enable": true,
        "transcriptionHook": "http://server.com/hook",
        "recognizer": {
          "vendor": "google",
          "language": "de-DE",
        }
      },
      "onHoldMusic": "http://server.com/hold",
      "actionHookDelayAction": {
        "enabled": true,
        "noResponseTimeout": 5,
        "noResponseGiveUpTimeout": 10,
        "retries": 3,
        "actions": [
          {
            "verb": "say",
            "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
            "synthesizer": {
              "vendor": "google",
              "language": "en-US"
            }
          },
          {
            "verb": "play",
            "url": "https://example.com/example.mp3",
            "timeoutSecs": 10,
            "seekOffset": 8000,
            "actionHook": "/play/action"
          }
        ]
      }
    },
    {
      "verb": "config",
      "notifySttLatency": true,
      "recognizer": {
        "vendor": "google",
        "language": "de-DE",
        "label": "label1",
        "assemblyAiOptions": {
          "apiKey": "apikey",
          "serviceVersion": "v3",
          "formatTurns": true,
          "endOfTurnConfidenceThreshold": 0.5,
          "minEndOfTurnSilenceWhenConfident": 500,
          "maxTurnSilence": 2000
        }
      }
    },
    {
      "verb": "config",
      "referHook": "https://referhook.com"
    },
    {
      "verb": "config",
      "referHook": {
        "url": "https://referhook.com"
      }
    },
    {
      "verb": "config",
      "recognizer": {
        "vendor": "google",
        "language": "de-DE",
        "label": "label1",
        "azureOptions": {
          "languageIdMode": "Continuous"
        }
      }
    },
    {
      "verb": "config",
      "record": {
      "action": "startCallRecording",
      "siprecServerURL": ["sip:srs@recording.example.com","sip:srs@recording.example.com"],
      "headers" : {
        "X-Header1": "Value1",
        "X-Header2": "Value2"
      }
      }
    },
    {
      "verb": "config",
      "sipRequestWithinDialogHook": "https://jambonz.or/sipIndialogActionHook"
    },
    {
      "verb": "config",
      "record": {
      "action": "startCallRecording",
      "siprecServerURL": "sip:srs@recording.example.com"
      }
    },
    {
      "verb": "dequeue",
      "name": "support",
      "beep": true,
      "timeout": 60,
      "callSid": "call_sid1234"
    },
    {
      "verb": "dial",
      "actionHook": "/outdial",
      "onHoldHook": "/onHoldHook",
      "callerId": "+16173331212",
      "callerName": "Tom",
      "answerOnBridge": true,
      "dtmfCapture": ["*2", "*3"],
      "timeLimit": 10,
      "dtmfHook": {
        "url": "/dtmf",
        "method": "GET"
      },
      "amd": {
        "actionHook": "/answeringMachineDetection",
    
      },
      "target": [
        {
          "type": "phone",
          "number": "+15083084809",
          "trunk": "Twilio"
        },
        {
          "type": "sip",
          "sipUri": "sip:1617333456@sip.trunk1.com",
          "auth": {
            "username": "foo",
            "password": "bar"
          }
        },
        {
          "type": "user",
          "name": "spike@sip.example.com"
        }
      ]
    },
    {
      "verb": "dialogflow",
      "project": "ai-in-rtc-drachtio-tsjjpn",
      "lang": "en-US",
      "credentials": "{\"type\": \"service_account\",\"project_id\": \"prj..",
      "welcomeEvent": "welcome",
      "eventHook": "/dialogflow-event",
      "actionHook": "/dialogflow-action"
    },
    {
      "verb": "dtmf",
      "dtmf": "0276",
      "duration": 250
    },
    {
      "verb": "enqueue",
      "name": "support",
      "actionHook": "/queue-action",
      "waitHook": "/queue-wait",
      "priority": 50
    },
    {
      "verb": "gather",
      "actionHook": "http://example.com/collect",
      "input": ["digits", "speech"],
      "bargein": true,
      "dtmfBargein": true,
      "finishOnKey": "#",
      "numDigits": 5,
      "timeout": 8,
      "recognizer": {
        "vendor": "google",
        "language": "en-US",
        "hints": ["sales", "support"],
        "hintsBoost": 10,
        "fastRecognitionTimeout": 2000,
        "deepgramOptions": {
          "endpointing": 500,
          "noDelay": true,
          preflightThreshold: 1000,
          eotThreshold: 500,
          eotTimeoutMs: 5000,
          mipOptOut: true
        }
      },
      "say": {
        "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
        "synthesizer": {
          "vendor": "google",
          "language": "en-US",
          "label": "label1",
          "fallbackVendor": "google",
          "fallbackLanguage": "en-US",
          "fallbackLabel": "label1",
          "fallbackVoice": "voice"
        }
      },
      "say": {
        "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
        "instructions": "Voice: High-energy, upbeat, and encouraging, projecting enthusiasm and motivation."
      },
      "say": {
        "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
        "synthesizer": {
          "vendor": "google",
          "language": "en-US",
          "voice": {
            "reportedUsage":"REALTIME",
            "model":"path/to/model",
           },
          "fallbackVendor": "google",
          "fallbackLanguage": "en-US",
          "fallbackLabel": "label1",
          "fallbackVoice": {
            "reportedUsage":"REALTIME",
            "model":"path/to/model",
           }
        }
      }
    },
    {
      "verb": "gather",
      "actionHook": "http://example.com/collect",
      "input": ["digits", "speech"],
      "bargein": true,
      "dtmfBargein": true,
      "finishOnKey": "#",
      "numDigits": 5,
      "timeout": 8,
      "recognizer": {
        "vendor": "verbio",
        "language": "en-US",
        "verbioOptions": {
          "enable_formatting": true,
          "enable_diarization": true,
          "topic": 0,
          "inline_grammar": "this is inline grammar",
          "grammar_uri": "https://grammar_uri.com",
          "label": "label",
          "recognition_timeout": 500,
          "speech_complete_timeout": 500,
          "speech_incomplete_timeout": 500,
        }
      },
    },
    {
      "verb": "gather",
      "actionHook": "http://example.com/collect",
      "input": ["digits", "speech"],
      "bargein": true,
      "dtmfBargein": true,
      "finishOnKey": "#",
      "numDigits": 5,
      "timeout": 8,
      "recognizer": {
        "vendor": "google",
        "language": "en-US",
        "fallbackVendor": "google",
        "fallbackLanguage": "en-US",
        "fallbackLabel": "label1",
        "hints": ["sales", "support"],
        "hintsBoost": 10,
        "deepgramOptions": {
          "endpointing": true
        }
      },
      "actionHookDelayAction": {
        "noResponseTimeout": 5,
        "noResponseGiveUpTimeout": 10,
        "retries": 3,
        "actions": [
          {
            "verb": "say",
            "text": "To speak to Sales press 1 or say Sales.  To speak to customer support press 2 or say Support",
            "synthesizer": {
              "vendor": "google",
              "language": "en-US"
            }
          },
          {
            "verb": "play",
            "url": "https://example.com/example.mp3",
            "timeoutSecs": 10,
            "seekOffset": 8000,
            "actionHook": "/play/action"
          }
        ]
      }
    },
    {
      "verb": "hangup",
      "headers": {
        "X-Reason" : "maximum call duration exceeded"
      }
    },
    {
      "verb": "leave"
    },
    {
      "verb": "lex",
      "botId": "MTLNerCD9L",
      "botAlias": "z5yY1iYykE",
      "region": "us-east-1",
      "locale": "en_US",
      "credentials": {
        "accessKey": "XXXX",
        "secretAccessKey": "YYYY"
      },
      "passDtmf": true,
      "intent": {"name":"BookHotel"},
      "metadata": {
        "slots": {
          "Location": "Los Angeles"
        },
        "context": {
          "callerId": "+15083084909",
          "customerName": "abc company"
        }
      },
      "tts": {
        "vendor": "google",
        "language": "en-US",
        "voice": "en-US-Wavenet-C"
      },
      "eventHook": "/lex-events"
    },
    {
      "verb": "listen",
      "url": "wss://myrecorder.example.com/calls",
      "mixType" : "stereo"
    },
    {
      "verb": "listen",
      "url": "wss://myrecorder.example.com/calls",
      "mixType" : "stereo",
      "bidirectionalAudio": {
        enabled: true,
        streaming: true,
        sampleRate: 8000
     }
    },
    {
      "verb": "config",
      "listen": {
        "enable": true,
        "url": "wss://myrecorder.example.com/calls",
        "mixType" : "stereo",
        "bidirectionalAudio": {
          enabled: true,
          streaming: true,
          sampleRate: 8000
       }
      }
    },
    {
      "verb": "config",
      "autoStreamTts": true
    },
    {
      "verb": "config",
      "vad": {
        "enable": true,
        "voiceMs": 250,
        "silenceMs": 150,
        "strategy": "one-shot",
        "mode": 2,
        "vendor": "webrtc",
        "threshold": 0.5,
        "speechPadMs": 1000
      }
    },
    {
      "verb": "message",
      "to": "15083084809",
      "from": "16173334567",
      "text": "Your one-time passcode is 1234",
      "actionHook": "/sms/action"
    },
    {
      "verb": "pause",
      "length": 3
    },
    {
      "verb": "play",
      "url": "https://example.com/example.mp3",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    },
    {
      "verb": "rasa",
      "url": "http://my-assitant.acme.com/webhooks/rest/webhook?token=foobarbazzle",
      "prompt": "Hello there!  What can I do for you today?",
      "eventHook": "/rasa/event",
      "actionHook": "/rasa/action"
    },
    {
      "verb": "redirect",
      "actionHook": "/connectToSales",
    },
    {
      "verb": "say",
      "text": "hi there!",
      "synthesizer" : {
        "vendor": "google",
        "language": "en-US"
      }
    },
    {
      "verb": "sip:decline",
      "status": 480,
      "reason": "Gone Fishing",
      "headers" : {
        "Retry-After": 1800
      }
    },
    {
      "verb": "sip:request",
      "method": "INFO",
      "headers": {
        "X-Metadata": "my sip metadata"
      },
      "actionHook": "/info"
    },
    {
      "verb": "sip:refer",
      "referTo": "+15083084809",
      "actionHook": "/action"
    },
    {
      "verb": "sip:refer",
      "referTo": "+15083084809",
      "referredByDisplayName": "Alice",
      "actionHook": "/action"
    },
    {
      "verb": "tag",
      "data": {
        "foo": "bar",
        "counter": 100,
        "list": [1, 2, "three"]
      }
    },
    {
      "verb": "transcribe",
      "transcriptionHook": "http://example.com/transcribe",
      "recognizer": {
        "vendor": "nvidia",
        "language" : "en-US",
        "interim": true
      }
    },
    {
      "verb": "transcribe",
      "transcriptionHook": "http://example.com/transcribe",
      "recognizer": {
        "vendor": "nvidia",
        "language" : "en-US",
        "customOptions": {
          "sampleRate": 16000
        }
      }
    },
    {
      "verb": "transcribe",
      "transcriptionHook": "http://example.com/transcribe",
      "recognizer": {
        "vendor": "nvidia",
        "language" : "en-US",
        "interim": true,
        "googleOptions": {
          "serviceVersion": "v2",
          "speechStartTimeoutMs": 500,
          "speechEndTimeoutMs": 1000,
          "enableVoiceActivityEvents": true,
          "transcriptNormalization" : [
            {
              "search": "dog",
              "replace": "cat",
              "case_sensitive": true
            }
          ]
        }
      }
    },
    {
      "verb": "rest:dial",
      "account_sid": "1291964182631236912836123912",
      "call_hook": {
        "url": "http://127.0.0.1:3100/",
        "method": "POST",
        "username": "username",
        "password": "password",
      },
      "from": "15583084810",
      "to": {
        "type": "phone",
        "number": "15583084809",
      },
      "tag": {
        "customer": "acme",
        "referenceId": "deadbeef",
      },
      "amd": {
        "actionHook": "/answeringMachineDetection",
    
      },
      "dual_streams": true,
      "timeLimit" : 10
    },
    {
      "verb": "llm",
      "vendor": 'ultravox',
      "model": 'fixie-ai/ultravox',
      "auth": {
        "apiKey": "sk-1234567890abcdefg"
      },
      "llmOptions": {
        "firstSpeaker": 'FIRST_SPEAKER_AGENT',
      },
      "mcpServers": [
        {
          "url": 'https://mcp.example.com',
          "auth": {
            "username": 'username',
            "password": 'password'
          }
        }
      ]
    }
  ];
  try {
    validate(logger, verbs);
    t.ok(1 == 1,'successfully validate verbs');
  } catch(err) {
    t.fail('validate should not fail here. with reason: ' + err);
  }
  
  t.end();
});

test('invalid test', async (t) => {
  verbs = [
    {
      "verb": "play",
      "timeoutSecs": 10,
      "seekOffset": 8000,
      "actionHook": "/play/action"
    }
  ];
  try {
    validate(logger, verbs);
    t.fail('validate should not fail here. with reason: ' + err);
  } catch(err) {
    t.ok(1 == 1,'successfully validate verbs');
  }
  
  t.end();
})