[{
  "grammar": {
    "-xmlns": "http://relaxng.org/ns/structure/1.0",
    "-xmlns:a": "http://relaxng.org/ns/compatibility/annotations/1.0",
    "-xmlns:xlink": "http://www.w3.org/1999/xlink",
    "-ns": "http://www.tei-c.org/ns/1.0",
    "-datatypeLibrary": "http://www.w3.org/2001/XMLSchema-datatypes",
    "define": [
      {
        "-name": "tei_macro.paraContent",
        "zeroOrMore": {
          "choice": {
            "ref": [
              { "-name": "tei_model.gLike" },
              { "-name": "tei_model.phrase" },
              { "-name": "tei_model.inter" },
              { "-name": "tei_model.global" }
            ]
          }
        }
      },
      {
        "-name": "tei_macro.phraseSeq",
        "zeroOrMore": {
          "choice": {
            "ref": [
              { "-name": "tei_model.gLike" },
              { "-name": "tei_model.phrase" },
              { "-name": "tei_model.global" }
            ]
          }
        }
      },
      {
        "-name": "tei_macro.specialPara",
        "zeroOrMore": {
          "choice": {
            "ref": [
              { "-name": "tei_model.gLike" },
              { "-name": "tei_model.phrase" },
              { "-name": "tei_model.inter" },
              { "-name": "tei_model.divPart" },
              { "-name": "tei_model.global" }
            ]
          }
        }
      },
      {
        "-name": "tei_data.certainty",
        "choice": {
          "value": [
            "high",
            "medium",
            "low",
            "unknown"
          ]
        }
      },
      {
        "-name": "tei_data.probability",
        "data": {
          "-type": "double",
          "param": [
            {
              "-name": "minInclusive",
              "#text": "0"
            },
            {
              "-name": "maxInclusive",
              "#text": "1"
            }
          ]
        }
      },
      {
        "-name": "tei_data.numeric",
        "choice": {
          "data": [
            { "-type": "double" },
            {
              "-type": "token",
              "param": {
                "-name": "pattern",
                "#text": "(\\-?[\\d]+/\\-?[\\d]+)"
              }
            },
            { "-type": "decimal" }
          ]
        }
      },
      {
        "-name": "tei_data.count",
        "data": { "-type": "nonNegativeInteger" }
      },
      {
        "-name": "tei_data.temporal.w3c",
        "choice": {
          "data": [
            { "-type": "date" },
            { "-type": "gYear" },
            { "-type": "gMonth" },
            { "-type": "gDay" },
            { "-type": "gYearMonth" },
            { "-type": "gMonthDay" },
            { "-type": "time" },
            { "-type": "dateTime" }
          ]
        }
      },
      {
        "-name": "tei_data.truthValue",
        "data": { "-type": "boolean" }
      },
      {
        "-name": "tei_data.xTruthValue",
        "choice": {
          "data": { "-type": "boolean" },
          "value": [
            "unknown",
            "inapplicable"
          ]
        }
      },
      {
        "-name": "tei_data.language",
        "data": { "-type": "language" }
      },
      {
        "-name": "tei_data.pointer",
        "data": { "-type": "anyURI" }
      },
      {
        "-name": "tei_data.key",
        "data": { "-type": "string" }
      },
      {
        "-name": "tei_data.word",
        "data": {
          "-type": "token",
          "param": {
            "-name": "pattern",
            "#text": "(\\p{L}|\\p{N}|\\p{P}|\\p{S})+"
          }
        }
      },
      {
        "-name": "tei_data.name",
        "data": { "-type": "Name" }
      },
      {
        "-name": "tei_data.enumerated",
        "ref": { "-name": "tei_data.name" }
      },
      {
        "-name": "tei_data.temporal.iso",
        "choice": {
          "data": [
            { "-type": "date" },
            { "-type": "gYear" },
            { "-type": "gMonth" },
            { "-type": "gDay" },
            { "-type": "gYearMonth" },
            { "-type": "gMonthDay" },
            { "-type": "time" },
            { "-type": "dateTime" },
            {
              "-type": "token",
              "param": {
                "-name": "pattern",
                "#text": "[0-9.,DHMPRSTWYZ/:+\\-]+"
              }
            }
          ]
        }
      },
      {
        "-name": "tei_att.canonical.attributes",
        "ref": [
          { "-name": "tei_att.canonical.attribute.key" },
          { "-name": "tei_att.canonical.attribute.ref" }
        ]
      },
      {
        "-name": "tei_att.canonical.attribute.key",
        "optional": {
          "attribute": {
            "-name": "key",
            "a:documentation": "provides an externally-defined means of identifying the entity (or entities) being named, using a coded value of some kind.",
            "ref": { "-name": "tei_data.key" }
          }
        }
      },
      {
        "-name": "tei_att.canonical.attribute.ref",
        "optional": {
          "attribute": {
            "-name": "ref",
            "a:documentation": "(reference) provides an explicit means of locating a full definition for the entity being named by means of one or more URIs.",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.ranging.attributes",
        "ref": [
          { "-name": "tei_att.ranging.attribute.atLeast" },
          { "-name": "tei_att.ranging.attribute.atMost" },
          { "-name": "tei_att.ranging.attribute.min" },
          { "-name": "tei_att.ranging.attribute.max" },
          { "-name": "tei_att.ranging.attribute.confidence" }
        ]
      },
      {
        "-name": "tei_att.ranging.attribute.atLeast",
        "optional": {
          "attribute": {
            "-name": "atLeast",
            "a:documentation": "gives a minimum estimated value for the approximate measurement.",
            "ref": { "-name": "tei_data.numeric" }
          }
        }
      },
      {
        "-name": "tei_att.ranging.attribute.atMost",
        "optional": {
          "attribute": {
            "-name": "atMost",
            "a:documentation": "gives a maximum estimated value for the approximate measurement.",
            "ref": { "-name": "tei_data.numeric" }
          }
        }
      },
      {
        "-name": "tei_att.ranging.attribute.min",
        "optional": {
          "attribute": {
            "-name": "min",
            "a:documentation": "where the measurement summarizes more than one observation or a range, supplies the minimum value observed.",
            "ref": { "-name": "tei_data.numeric" }
          }
        }
      },
      {
        "-name": "tei_att.ranging.attribute.max",
        "optional": {
          "attribute": {
            "-name": "max",
            "a:documentation": "where the measurement summarizes more than one observation or a range, supplies the maximum value observed.",
            "ref": { "-name": "tei_data.numeric" }
          }
        }
      },
      {
        "-name": "tei_att.ranging.attribute.confidence",
        "optional": {
          "attribute": {
            "-name": "confidence",
            "a:documentation": "The degree of statistical confidence (between zero and one) that a value falls within the range specified by min and max, or the proportion of observed values that fall within that range.",
            "ref": { "-name": "tei_data.probability" }
          }
        }
      },
      {
        "-name": "tei_att.dimensions.attributes",
        "ref": [
          { "-name": "tei_att.ranging.attributes" },
          { "-name": "tei_att.dimensions.attribute.unit" },
          { "-name": "tei_att.dimensions.attribute.quantity" },
          { "-name": "tei_att.dimensions.attribute.extent" },
          { "-name": "tei_att.dimensions.attribute.precision" },
          { "-name": "tei_att.dimensions.attribute.scope" }
        ]
      },
      {
        "-name": "tei_att.dimensions.attribute.unit",
        "optional": {
          "attribute": {
            "-name": "unit",
            "a:documentation": "names the unit used for the measurement Suggested values include: 1] cm(centimetres) ; 2] mm(millimetres) ; 3] in(inches) ; 4] lines; 5] chars(characters)",
            "choice": {
              "value": [
                "cm",
                "mm",
                "in",
                "lines",
                "chars"
              ],
              "a:documentation": [
                "(centimetres)",
                "(millimetres)",
                "(inches)",
                "lines of text",
                "(characters) characters of text"
              ],
              "data": { "-type": "Name" }
            }
          }
        }
      },
      {
        "-name": "tei_att.dimensions.attribute.quantity",
        "optional": {
          "attribute": {
            "-name": "quantity",
            "a:documentation": "specifies the length in the units specified",
            "ref": { "-name": "tei_data.numeric" }
          }
        }
      },
      {
        "-name": "tei_att.dimensions.attribute.extent",
        "optional": {
          "attribute": {
            "-name": "extent",
            "a:documentation": "indicates the size of the object concerned using a project-specific vocabulary combining quantity and units in a single string of words.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.dimensions.attribute.precision",
        "optional": {
          "attribute": {
            "-name": "precision",
            "a:documentation": "characterizes the precision of the values specified by the other attributes.",
            "ref": { "-name": "tei_data.certainty" }
          }
        }
      },
      {
        "-name": "tei_att.dimensions.attribute.scope",
        "optional": {
          "attribute": {
            "-name": "scope",
            "a:documentation": "where the measurement summarizes more than one observation, specifies the applicability of this measurement. Sample values include: 1] all; 2] most; 3] range",
            "ref": { "-name": "tei_data.enumerated" }
          }
        }
      },
      {
        "-name": "tei_att.datable.w3c.attributes",
        "ref": [
          { "-name": "tei_att.datable.w3c.attribute.when" },
          { "-name": "tei_att.datable.w3c.attribute.notBefore" },
          { "-name": "tei_att.datable.w3c.attribute.notAfter" },
          { "-name": "tei_att.datable.w3c.attribute.from" },
          { "-name": "tei_att.datable.w3c.attribute.to" }
        ]
      },
      {
        "-name": "tei_att.datable.w3c.attribute.when",
        "optional": {
          "attribute": {
            "-name": "when",
            "a:documentation": "supplies the value of the date or time in a standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.w3c" }
          }
        }
      },
      {
        "-name": "tei_att.datable.w3c.attribute.notBefore",
        "optional": {
          "attribute": {
            "-name": "notBefore",
            "a:documentation": "specifies the earliest possible date for the event in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.w3c" }
          }
        }
      },
      {
        "-name": "tei_att.datable.w3c.attribute.notAfter",
        "optional": {
          "attribute": {
            "-name": "notAfter",
            "a:documentation": "specifies the latest possible date for the event in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.w3c" }
          }
        }
      },
      {
        "-name": "tei_att.datable.w3c.attribute.from",
        "optional": {
          "attribute": {
            "-name": "from",
            "a:documentation": "indicates the starting point of the period in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.w3c" }
          }
        }
      },
      {
        "-name": "tei_att.datable.w3c.attribute.to",
        "optional": {
          "attribute": {
            "-name": "to",
            "a:documentation": "indicates the ending point of the period in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.w3c" }
          }
        }
      },
      {
        "-name": "tei_att.datable.attributes",
        "ref": [
          { "-name": "tei_att.datable.w3c.attributes" },
          { "-name": "tei_att.datable.iso.attributes" },
          { "-name": "tei_att.datable.custom.attributes" },
          { "-name": "tei_att.datable.attribute.calendar" },
          { "-name": "tei_att.datable.attribute.period" }
        ]
      },
      {
        "-name": "tei_att.datable.attribute.calendar",
        "optional": {
          "attribute": {
            "-name": "calendar",
            "a:documentation": "indicates the system or calendar to which the date represented by the content of this element belongs.",
            "ref": { "-name": "tei_data.pointer" }
          }
        }
      },
      {
        "-name": "tei_att.datable.attribute.period",
        "optional": {
          "attribute": {
            "-name": "period",
            "a:documentation": "supplies a pointer to some location defining a named period of time within which the datable item is understood to have occurred.",
            "ref": { "-name": "tei_data.pointer" }
          }
        }
      },
      {
        "-name": "tei_att.declarable.attributes",
        "ref": { "-name": "tei_att.declarable.attribute.default" }
      },
      {
        "-name": "tei_att.declarable.attribute.default",
        "optional": {
          "attribute": {
            "-name": "default",
            "-a:defaultValue": "false",
            "a:documentation": "indicates whether or not this element is selected by default when its parent is selected.",
            "choice": {
              "value": [
                "true",
                "false"
              ],
              "a:documentation": [
                "This element is selected if its parent is selected",
                "This element can only be selected explicitly, unless it is the only one of its kind, in which case it is selected if its parent is selected."
              ]
            }
          }
        }
      },
      {
        "-name": "tei_att.responsibility.attributes",
        "ref": [
          { "-name": "tei_att.responsibility.attribute.cert" },
          { "-name": "tei_att.responsibility.attribute.resp" }
        ]
      },
      {
        "-name": "tei_att.responsibility.attribute.cert",
        "optional": {
          "attribute": {
            "-name": "cert",
            "a:documentation": "(certainty) signifies the degree of certainty associated with the intervention or interpretation.",
            "ref": { "-name": "tei_data.certainty" }
          }
        }
      },
      {
        "-name": "tei_att.responsibility.attribute.resp",
        "optional": {
          "attribute": {
            "-name": "resp",
            "a:documentation": "(responsible party) indicates the agency responsible for the intervention or interpretation, for example an editor or transcriber.",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.editLike.attributes",
        "ref": [
          { "-name": "tei_att.dimensions.attributes" },
          { "-name": "tei_att.responsibility.attributes" },
          { "-name": "tei_att.editLike.attribute.evidence" },
          { "-name": "tei_att.editLike.attribute.source" },
          { "-name": "tei_att.editLike.attribute.instant" }
        ]
      },
      {
        "-name": "tei_att.editLike.attribute.evidence",
        "optional": {
          "attribute": {
            "-name": "evidence",
            "a:documentation": "indicates the nature of the evidence supporting the reliability or accuracy of the intervention or interpretation. Suggested values include: 1] internal; 2] external; 3] conjecture",
            "list": {
              "choice": {
                "value": [
                  "internal",
                  "external",
                  "conjecture"
                ],
                "a:documentation": [
                  "there is internal evidence to support the intervention.",
                  "there is external evidence to support the intervention.",
                  "the intervention or interpretation has been made by the editor, cataloguer, or scholar on the basis of their expertise."
                ],
                "data": { "-type": "Name" }
              },
              "zeroOrMore": {
                "choice": {
                  "value": [
                    "internal",
                    "external",
                    "conjecture"
                  ],
                  "a:documentation": [
                    "there is internal evidence to support the intervention.",
                    "there is external evidence to support the intervention.",
                    "the intervention or interpretation has been made by the editor, cataloguer, or scholar on the basis of their expertise."
                  ],
                  "data": { "-type": "Name" }
                }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.editLike.attribute.source",
        "optional": {
          "attribute": {
            "-name": "source",
            "a:documentation": "contains a list of one or more pointers indicating sources supporting the given intervention or interpretation.",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.editLike.attribute.instant",
        "optional": {
          "attribute": {
            "-name": "instant",
            "-a:defaultValue": "false",
            "a:documentation": "Is this an instant revision?",
            "ref": { "-name": "tei_data.xTruthValue" }
          }
        }
      },
      {
        "-name": "tei_att.global.attributes",
        "ref": [
          { "-name": "tei_att.global.attribute.xmlid" },
          { "-name": "tei_att.global.attribute.n" },
          { "-name": "tei_att.global.attribute.xmllang" },
          { "-name": "tei_att.global.attribute.rendition" }
        ]
      },
      {
        "-name": "tei_att.global.attribute.xmlid",
        "optional": {
          "attribute": {
            "-name": "xml:id",
            "a:documentation": "(identifier) provides a unique identifier for the element bearing the attribute.",
            "data": { "-type": "ID" }
          }
        }
      },
      {
        "-name": "tei_att.global.attribute.n",
        "optional": {
          "attribute": {
            "-name": "n",
            "a:documentation": "(number) gives a number (or other label) for an element, which is not necessarily unique within the document.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.global.attribute.xmllang",
        "optional": {
          "attribute": {
            "-name": "xml:lang",
            "a:documentation": "(language) indicates the language of the element content using a tag generated according to BCP 47",
            "ref": { "-name": "tei_data.language" }
          }
        }
      },
      {
        "-name": "tei_att.global.attribute.rendition",
        "optional": {
          "attribute": {
            "-name": "rendition",
            "a:documentation": "points to a description of the rendering or presentation used for this element in the source text.",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.naming.attributes",
        "ref": [
          { "-name": "tei_att.canonical.attributes" },
          { "-name": "tei_att.naming.attribute.role" },
          { "-name": "tei_att.naming.attribute.nymRef" }
        ]
      },
      {
        "-name": "tei_att.naming.attribute.role",
        "optional": {
          "attribute": {
            "-name": "role",
            "a:documentation": "may be used to specify further information about the entity referenced by this name, for example the occupation of a person, or the status of a place.",
            "ref": { "-name": "tei_data.enumerated" }
          }
        }
      },
      {
        "-name": "tei_att.naming.attribute.nymRef",
        "optional": {
          "attribute": {
            "-name": "nymRef",
            "a:documentation": "(reference to the canonical name) provides a means of locating the canonical form (nym) of the names associated with the object named by the element bearing it.",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.placement.attributes",
        "ref": { "-name": "tei_att.placement.attribute.place" }
      },
      {
        "-name": "tei_att.placement.attribute.place",
        "optional": {
          "attribute": {
            "-name": "place",
            "a:documentation": "Suggested values include: 1] below; 2] bottom; 3] margin; 4] top; 5] opposite; 6] overleaf; 7] above; 8] end; 9] inline; 10] inspace",
            "list": {
              "choice": {
                "value": [
                  "below",
                  "bottom",
                  "margin",
                  "top",
                  "opposite",
                  "overleaf",
                  "above",
                  "end",
                  "inline",
                  "inspace"
                ],
                "a:documentation": [
                  "below the line",
                  "at the foot of the page",
                  "in the margin (left, right, or both)",
                  "at the top of the page",
                  "on the opposite, i.e. facing, page",
                  "on the other side of the leaf",
                  "above the line",
                  "at the end of e.g. chapter or volume.",
                  "within the body of the text.",
                  "in a predefined space, for example left by an earlier scribe."
                ],
                "data": { "-type": "Name" }
              },
              "zeroOrMore": {
                "choice": {
                  "value": [
                    "below",
                    "bottom",
                    "margin",
                    "top",
                    "opposite",
                    "overleaf",
                    "above",
                    "end",
                    "inline",
                    "inspace"
                  ],
                  "a:documentation": [
                    "below the line",
                    "at the foot of the page",
                    "in the margin (left, right, or both)",
                    "at the top of the page",
                    "on the opposite, i.e. facing, page",
                    "on the other side of the leaf",
                    "above the line",
                    "at the end of e.g. chapter or volume.",
                    "within the body of the text.",
                    "in a predefined space, for example left by an earlier scribe."
                  ],
                  "data": { "-type": "Name" }
                }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.typed.attributes",
        "ref": [
          { "-name": "tei_att.typed.attribute.type" },
          { "-name": "tei_att.typed.attribute.subtype" }
        ]
      },
      {
        "-name": "tei_att.typed.attribute.type",
        "optional": {
          "attribute": {
            "-name": "type",
            "a:documentation": "characterizes the element in some sense, using any convenient classification scheme or typology.",
            "ref": { "-name": "tei_data.enumerated" }
          }
        }
      },
      {
        "-name": "tei_att.typed.attribute.subtype",
        "optional": {
          "attribute": {
            "-name": "subtype",
            "a:documentation": "provides a sub-categorization of the element, if needed",
            "ref": { "-name": "tei_data.enumerated" }
          }
        }
      },
      {
        "-name": "tei_att.pointing.attributes",
        "ref": [
          { "-name": "tei_att.pointing.attribute.target" },
          { "-name": "tei_att.pointing.attribute.evaluate" }
        ]
      },
      {
        "-name": "tei_att.pointing.attribute.target",
        "optional": {
          "attribute": {
            "-name": "target",
            "a:documentation": "specifies the destination of the reference by supplying one or more URI References",
            "list": {
              "ref": { "-name": "tei_data.pointer" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.pointer" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.pointing.attribute.evaluate",
        "optional": {
          "attribute": {
            "-name": "evaluate",
            "a:documentation": "specifies the intended meaning when the target of a pointer is itself a pointer.",
            "choice": {
              "value": [
                "all",
                "one",
                "none"
              ],
              "a:documentation": [
                "if the element pointed to is itself a pointer, then the target of that pointer will be taken, and so on, until an element is found which is not a pointer.",
                "if the element pointed to is itself a pointer, then its target (whether a pointer or not) is taken as the target of this pointer.",
                "no further evaluation of targets is carried out beyond that needed to find the element specified in the pointer's target."
              ]
            }
          }
        }
      },
      {
        "-name": "tei_att.sortable.attributes",
        "ref": { "-name": "tei_att.sortable.attribute.sortKey" }
      },
      {
        "-name": "tei_att.sortable.attribute.sortKey",
        "optional": {
          "attribute": {
            "-name": "sortKey",
            "a:documentation": "supplies the sort key for this element in an index, list or group which contains it.",
            "ref": { "-name": "tei_data.word" }
          }
        }
      },
      {
        "-name": "tei_model.nameLike.agent",
        "choice": {
          "ref": [
            { "-name": "tei_name" },
            { "-name": "tei_orgName" },
            { "-name": "tei_persName" }
          ]
        }
      },
      {
        "-name": "tei_model.nameLike.agent_alternation",
        "choice": {
          "ref": [
            { "-name": "tei_name" },
            { "-name": "tei_orgName" },
            { "-name": "tei_persName" }
          ]
        }
      },
      {
        "-name": "tei_model.nameLike.agent_sequence",
        "ref": [
          { "-name": "tei_name" },
          { "-name": "tei_orgName" },
          { "-name": "tei_persName" }
        ]
      },
      {
        "-name": "tei_model.nameLike.agent_sequenceOptional",
        "optional": [
          {
            "ref": { "-name": "tei_name" }
          },
          {
            "ref": { "-name": "tei_orgName" }
          },
          {
            "ref": { "-name": "tei_persName" }
          }
        ]
      },
      {
        "-name": "tei_model.nameLike.agent_sequenceOptionalRepeatable",
        "zeroOrMore": [
          {
            "ref": { "-name": "tei_name" }
          },
          {
            "ref": { "-name": "tei_orgName" }
          },
          {
            "ref": { "-name": "tei_persName" }
          }
        ]
      },
      {
        "-name": "tei_model.nameLike.agent_sequenceRepeatable",
        "oneOrMore": [
          {
            "ref": { "-name": "tei_name" }
          },
          {
            "ref": { "-name": "tei_orgName" }
          },
          {
            "ref": { "-name": "tei_persName" }
          }
        ]
      },
      { "-name": "tei_model.segLike" },
      { "-name": "tei_model.segLike_alternation" },
      { "-name": "tei_model.segLike_sequence" },
      { "-name": "tei_model.segLike_sequenceOptional" },
      { "-name": "tei_model.segLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.segLike_sequenceRepeatable" },
      {
        "-name": "tei_model.emphLike",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.emphLike_alternation",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.emphLike_sequence",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.emphLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.emphLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.emphLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.highlighted",
        "ref": { "-name": "tei_model.emphLike" }
      },
      {
        "-name": "tei_model.highlighted_alternation",
        "ref": { "-name": "tei_model.emphLike_alternation" }
      },
      {
        "-name": "tei_model.highlighted_sequence",
        "ref": { "-name": "tei_model.emphLike_sequence" }
      },
      {
        "-name": "tei_model.highlighted_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_model.emphLike_sequenceOptional" }
        }
      },
      {
        "-name": "tei_model.highlighted_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_model.emphLike_sequenceOptionalRepeatable" }
        }
      },
      {
        "-name": "tei_model.highlighted_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_model.emphLike_sequenceRepeatable" }
        }
      },
      {
        "-name": "tei_model.dateLike",
        "ref": { "-name": "tei_date" }
      },
      {
        "-name": "tei_model.dateLike_alternation",
        "ref": { "-name": "tei_date" }
      },
      {
        "-name": "tei_model.dateLike_sequence",
        "ref": { "-name": "tei_date" }
      },
      {
        "-name": "tei_model.dateLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_date" }
        }
      },
      {
        "-name": "tei_model.dateLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_date" }
        }
      },
      {
        "-name": "tei_model.dateLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_date" }
        }
      },
      { "-name": "tei_model.pPart.edit" },
      { "-name": "tei_model.pPart.edit_alternation" },
      { "-name": "tei_model.pPart.edit_sequence" },
      { "-name": "tei_model.pPart.edit_sequenceOptional" },
      { "-name": "tei_model.pPart.edit_sequenceOptionalRepeatable" },
      { "-name": "tei_model.pPart.edit_sequenceRepeatable" },
      { "-name": "tei_model.ptrLike" },
      { "-name": "tei_model.ptrLike_alternation" },
      { "-name": "tei_model.ptrLike_sequence" },
      { "-name": "tei_model.ptrLike_sequenceOptional" },
      { "-name": "tei_model.ptrLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.ptrLike_sequenceRepeatable" },
      { "-name": "tei_model.gLike" },
      {
        "-name": "tei_model.biblLike",
        "ref": { "-name": "tei_bibl" }
      },
      {
        "-name": "tei_model.biblLike_alternation",
        "ref": { "-name": "tei_bibl" }
      },
      {
        "-name": "tei_model.biblLike_sequence",
        "ref": { "-name": "tei_bibl" }
      },
      {
        "-name": "tei_model.biblLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_bibl" }
        }
      },
      {
        "-name": "tei_model.biblLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_bibl" }
        }
      },
      {
        "-name": "tei_model.biblLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_bibl" }
        }
      },
      { "-name": "tei_model.headLike" },
      { "-name": "tei_model.headLike_alternation" },
      { "-name": "tei_model.headLike_sequence" },
      { "-name": "tei_model.headLike_sequenceOptional" },
      { "-name": "tei_model.headLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.headLike_sequenceRepeatable" },
      { "-name": "tei_model.labelLike" },
      { "-name": "tei_model.labelLike_alternation" },
      { "-name": "tei_model.labelLike_sequence" },
      { "-name": "tei_model.labelLike_sequenceOptional" },
      { "-name": "tei_model.labelLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.labelLike_sequenceRepeatable" },
      { "-name": "tei_model.listLike" },
      { "-name": "tei_model.listLike_alternation" },
      { "-name": "tei_model.listLike_sequence" },
      { "-name": "tei_model.listLike_sequenceOptional" },
      { "-name": "tei_model.listLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.listLike_sequenceRepeatable" },
      {
        "-name": "tei_model.noteLike",
        "ref": { "-name": "tei_note" }
      },
      {
        "-name": "tei_model.noteLike_alternation",
        "ref": { "-name": "tei_note" }
      },
      {
        "-name": "tei_model.noteLike_sequence",
        "ref": { "-name": "tei_note" }
      },
      {
        "-name": "tei_model.noteLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_note" }
        }
      },
      {
        "-name": "tei_model.noteLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_note" }
        }
      },
      {
        "-name": "tei_model.noteLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_note" }
        }
      },
      {
        "-name": "tei_model.pLike",
        "ref": { "-name": "tei_p" }
      },
      {
        "-name": "tei_model.pLike_alternation",
        "ref": { "-name": "tei_p" }
      },
      {
        "-name": "tei_model.pLike_sequence",
        "ref": { "-name": "tei_p" }
      },
      {
        "-name": "tei_model.pLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_p" }
        }
      },
      {
        "-name": "tei_model.pLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_p" }
        }
      },
      {
        "-name": "tei_model.pLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_p" }
        }
      },
      {
        "-name": "tei_model.divPart",
        "ref": { "-name": "tei_model.pLike" }
      },
      {
        "-name": "tei_model.divPart_alternation",
        "ref": { "-name": "tei_model.pLike_alternation" }
      },
      {
        "-name": "tei_model.divPart_sequence",
        "ref": { "-name": "tei_model.pLike_sequence" }
      },
      {
        "-name": "tei_model.divPart_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_model.pLike_sequenceOptional" }
        }
      },
      {
        "-name": "tei_model.divPart_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_model.pLike_sequenceOptionalRepeatable" }
        }
      },
      {
        "-name": "tei_model.divPart_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_model.pLike_sequenceRepeatable" }
        }
      },
      {
        "-name": "tei_model.persStateLike",
        "ref": { "-name": "tei_persName" }
      },
      {
        "-name": "tei_model.persStateLike_alternation",
        "ref": { "-name": "tei_persName" }
      },
      {
        "-name": "tei_model.persStateLike_sequence",
        "ref": { "-name": "tei_persName" }
      },
      {
        "-name": "tei_model.persStateLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_persName" }
        }
      },
      {
        "-name": "tei_model.persStateLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_persName" }
        }
      },
      {
        "-name": "tei_model.persStateLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_persName" }
        }
      },
      {
        "-name": "tei_model.personLike",
        "ref": { "-name": "tei_org" }
      },
      {
        "-name": "tei_model.placeNamePart",
        "ref": { "-name": "tei_placeName" }
      },
      {
        "-name": "tei_model.placeNamePart_alternation",
        "ref": { "-name": "tei_placeName" }
      },
      {
        "-name": "tei_model.placeNamePart_sequence",
        "ref": { "-name": "tei_placeName" }
      },
      {
        "-name": "tei_model.placeNamePart_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_placeName" }
        }
      },
      {
        "-name": "tei_model.placeNamePart_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_placeName" }
        }
      },
      {
        "-name": "tei_model.placeNamePart_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_placeName" }
        }
      },
      {
        "-name": "tei_model.placeStateLike",
        "ref": { "-name": "tei_model.placeNamePart" }
      },
      {
        "-name": "tei_model.placeStateLike_alternation",
        "ref": { "-name": "tei_model.placeNamePart_alternation" }
      },
      {
        "-name": "tei_model.placeStateLike_sequence",
        "ref": { "-name": "tei_model.placeNamePart_sequence" }
      },
      {
        "-name": "tei_model.placeStateLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_model.placeNamePart_sequenceOptional" }
        }
      },
      {
        "-name": "tei_model.placeStateLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_model.placeNamePart_sequenceOptionalRepeatable" }
        }
      },
      {
        "-name": "tei_model.placeStateLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_model.placeNamePart_sequenceRepeatable" }
        }
      },
      { "-name": "tei_model.orgPart" },
      {
        "-name": "tei_model.publicationStmtPart",
        "ref": { "-name": "tei_date" }
      },
      { "-name": "tei_model.respLike" },
      { "-name": "tei_model.respLike_alternation" },
      { "-name": "tei_model.respLike_sequence" },
      { "-name": "tei_model.respLike_sequenceOptional" },
      { "-name": "tei_model.respLike_sequenceOptionalRepeatable" },
      { "-name": "tei_model.respLike_sequenceRepeatable" },
      {
        "-name": "tei_model.divTopPart",
        "ref": { "-name": "tei_model.headLike" }
      },
      {
        "-name": "tei_model.divTopPart_alternation",
        "ref": { "-name": "tei_model.headLike_alternation" }
      },
      {
        "-name": "tei_model.divTopPart_sequence",
        "ref": { "-name": "tei_model.headLike_sequence" }
      },
      {
        "-name": "tei_model.divTopPart_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_model.headLike_sequenceOptional" }
        }
      },
      {
        "-name": "tei_model.divTopPart_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_model.headLike_sequenceOptionalRepeatable" }
        }
      },
      {
        "-name": "tei_model.divTopPart_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_model.headLike_sequenceRepeatable" }
        }
      },
      {
        "-name": "tei_model.msQuoteLike",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.msQuoteLike_alternation",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.msQuoteLike_sequence",
        "ref": { "-name": "tei_title" }
      },
      {
        "-name": "tei_model.msQuoteLike_sequenceOptional",
        "optional": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.msQuoteLike_sequenceOptionalRepeatable",
        "zeroOrMore": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.msQuoteLike_sequenceRepeatable",
        "oneOrMore": {
          "ref": { "-name": "tei_title" }
        }
      },
      {
        "-name": "tei_model.nameLike",
        "choice": {
          "ref": [
            { "-name": "tei_model.nameLike.agent" },
            { "-name": "tei_model.placeStateLike" }
          ]
        }
      },
      {
        "-name": "tei_model.nameLike_alternation",
        "choice": {
          "ref": [
            { "-name": "tei_model.nameLike.agent_alternation" },
            { "-name": "tei_model.placeStateLike_alternation" }
          ]
        }
      },
      {
        "-name": "tei_model.nameLike_sequence",
        "ref": [
          { "-name": "tei_model.nameLike.agent_sequence" },
          { "-name": "tei_model.placeStateLike_sequence" }
        ]
      },
      {
        "-name": "tei_model.nameLike_sequenceOptional",
        "optional": [
          {
            "ref": { "-name": "tei_model.nameLike.agent_sequenceOptional" }
          },
          {
            "ref": { "-name": "tei_model.placeStateLike_sequenceOptional" }
          }
        ]
      },
      {
        "-name": "tei_model.nameLike_sequenceOptionalRepeatable",
        "zeroOrMore": [
          {
            "ref": { "-name": "tei_model.nameLike.agent_sequenceOptionalRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.placeStateLike_sequenceOptionalRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.nameLike_sequenceRepeatable",
        "oneOrMore": [
          {
            "ref": { "-name": "tei_model.nameLike.agent_sequenceRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.placeStateLike_sequenceRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.global",
        "ref": { "-name": "tei_model.noteLike" }
      },
      {
        "-name": "tei_model.biblPart",
        "choice": {
          "ref": [
            { "-name": "tei_model.respLike" },
            { "-name": "tei_bibl" }
          ]
        }
      },
      {
        "-name": "tei_model.pPart.data",
        "choice": {
          "ref": [
            { "-name": "tei_model.dateLike" },
            { "-name": "tei_model.nameLike" }
          ]
        }
      },
      {
        "-name": "tei_model.pPart.data_alternation",
        "choice": {
          "ref": [
            { "-name": "tei_model.dateLike_alternation" },
            { "-name": "tei_model.nameLike_alternation" }
          ]
        }
      },
      {
        "-name": "tei_model.pPart.data_sequence",
        "ref": [
          { "-name": "tei_model.dateLike_sequence" },
          { "-name": "tei_model.nameLike_sequence" }
        ]
      },
      {
        "-name": "tei_model.pPart.data_sequenceOptional",
        "optional": [
          {
            "ref": { "-name": "tei_model.dateLike_sequenceOptional" }
          },
          {
            "ref": { "-name": "tei_model.nameLike_sequenceOptional" }
          }
        ]
      },
      {
        "-name": "tei_model.pPart.data_sequenceOptionalRepeatable",
        "zeroOrMore": [
          {
            "ref": { "-name": "tei_model.dateLike_sequenceOptionalRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.nameLike_sequenceOptionalRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.pPart.data_sequenceRepeatable",
        "oneOrMore": [
          {
            "ref": { "-name": "tei_model.dateLike_sequenceRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.nameLike_sequenceRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.inter",
        "choice": {
          "ref": [
            { "-name": "tei_model.biblLike" },
            { "-name": "tei_model.labelLike" },
            { "-name": "tei_model.listLike" }
          ]
        }
      },
      {
        "-name": "tei_model.inter_alternation",
        "choice": {
          "ref": [
            { "-name": "tei_model.biblLike_alternation" },
            { "-name": "tei_model.labelLike_alternation" },
            { "-name": "tei_model.listLike_alternation" }
          ]
        }
      },
      {
        "-name": "tei_model.inter_sequence",
        "ref": [
          { "-name": "tei_model.biblLike_sequence" },
          { "-name": "tei_model.labelLike_sequence" },
          { "-name": "tei_model.listLike_sequence" }
        ]
      },
      {
        "-name": "tei_model.inter_sequenceOptional",
        "optional": [
          {
            "ref": { "-name": "tei_model.biblLike_sequenceOptional" }
          },
          {
            "ref": { "-name": "tei_model.labelLike_sequenceOptional" }
          },
          {
            "ref": { "-name": "tei_model.listLike_sequenceOptional" }
          }
        ]
      },
      {
        "-name": "tei_model.inter_sequenceOptionalRepeatable",
        "zeroOrMore": [
          {
            "ref": { "-name": "tei_model.biblLike_sequenceOptionalRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.labelLike_sequenceOptionalRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.listLike_sequenceOptionalRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.inter_sequenceRepeatable",
        "oneOrMore": [
          {
            "ref": { "-name": "tei_model.biblLike_sequenceRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.labelLike_sequenceRepeatable" }
          },
          {
            "ref": { "-name": "tei_model.listLike_sequenceRepeatable" }
          }
        ]
      },
      {
        "-name": "tei_model.phrase",
        "choice": {
          "ref": [
            { "-name": "tei_model.segLike" },
            { "-name": "tei_model.highlighted" },
            { "-name": "tei_model.pPart.edit" },
            { "-name": "tei_model.ptrLike" },
            { "-name": "tei_model.pPart.data" }
          ]
        }
      },
      { "-name": "tei_model.teiHeaderPart" },
      { "-name": "tei_model.sourceDescPart" },
      {
        "-name": "tei_att.personal.attributes",
        "ref": [
          { "-name": "tei_att.naming.attributes" },
          { "-name": "tei_att.personal.attribute.full" },
          { "-name": "tei_att.personal.attribute.sort" }
        ]
      },
      {
        "-name": "tei_att.personal.attribute.full",
        "optional": {
          "attribute": {
            "-name": "full",
            "-a:defaultValue": "yes",
            "a:documentation": "indicates whether the name component is given in full, as an abbreviation or simply as an initial.",
            "choice": {
              "value": [
                "yes",
                "abb",
                "init"
              ],
              "a:documentation": [
                "the name component is spelled out in full.",
                "(abbreviated) the name component is given in an abbreviated form.",
                "(initial letter) the name component is indicated only by one initial."
              ]
            }
          }
        }
      },
      {
        "-name": "tei_att.personal.attribute.sort",
        "optional": {
          "attribute": {
            "-name": "sort",
            "a:documentation": "specifies the sort order of the name component in relation to others within the personal name.",
            "ref": { "-name": "tei_data.count" }
          }
        }
      },
      { "-name": "tei_model.placeLike" },
      {
        "-name": "tei_p",
        "element": {
          "-name": "p",
          "a:documentation": "(paragraph) marks paragraphs in prose. [3.1. 7.2.5. ]",
          "ref": [
            { "-name": "tei_macro.paraContent" },
            { "-name": "tei_att.global.attributes" }
          ]
        }
      },
      {
        "-name": "tei_name",
        "element": {
          "-name": "name",
          "a:documentation": "(name, proper noun) contains a proper noun or noun phrase. [3.5.1. ]",
          "ref": [
            { "-name": "tei_macro.phraseSeq" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.naming.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ]
        }
      },
      {
        "-name": "tei_date",
        "element": {
          "-name": "date",
          "a:documentation": "contains a date in any format. [3.5.4. 2.2.4. 2.5. 3.11.2.3. 15.2.3. 13.3.6. ]",
          "zeroOrMore": {
            "choice": {
              "ref": [
                { "-name": "tei_model.gLike" },
                { "-name": "tei_model.phrase" },
                { "-name": "tei_model.global" }
              ]
            }
          },
          "ref": [
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.datable.attributes" },
            { "-name": "tei_att.editLike.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ]
        }
      },
      {
        "-name": "tei_note",
        "element": {
          "-name": "note",
          "a:documentation": "contains a note or annotation. [3.8.1. 2.2.6. 3.11.2.6. 9.3.5.4. ]",
          "ref": [
            { "-name": "tei_macro.specialPara" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.placement.attributes" },
            { "-name": "tei_att.pointing.attributes" },
            { "-name": "tei_att.responsibility.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ],
          "optional": [
            {
              "attribute": {
                "-name": "anchored",
                "-a:defaultValue": "true",
                "a:documentation": "indicates whether the copy text shows the exact place of reference for the note.",
                "ref": { "-name": "tei_data.truthValue" }
              }
            },
            {
              "attribute": {
                "-name": "targetEnd",
                "a:documentation": "points to the end of the span to which the note is attached, if the note is not embedded in the text at that point.",
                "list": {
                  "ref": { "-name": "tei_data.pointer" },
                  "zeroOrMore": {
                    "ref": { "-name": "tei_data.pointer" }
                  }
                }
              }
            }
          ]
        }
      },
      {
        "-name": "tei_title",
        "element": {
          "-name": "title",
          "a:documentation": "contains a title for any kind of work. [3.11.2.2. 2.2.1. 2.2.5. ]",
          "ref": [
            { "-name": "tei_macro.paraContent" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.canonical.attributes" }
          ],
          "optional": {
            "attribute": {
              "-name": "type",
              "a:documentation": "classifies the title according to some convenient typology. Sample values include: 1] main; 2] sub(subordinate) ; 3] alt(alternate) ; 4] short; 5] desc(descriptive)",
              "ref": { "-name": "tei_data.enumerated" }
            }
          }
        }
      },
      {
        "-name": "tei_bibl",
        "element": {
          "-name": "bibl",
          "a:documentation": "(bibliographic citation) contains a loosely-structured bibliographic citation of which the sub-components may or may not be explicitly tagged. [3.11.1. 2.2.7. 15.3.2. ]",
          "zeroOrMore": {
            "choice": {
              "ref": [
                { "-name": "tei_model.gLike" },
                { "-name": "tei_model.highlighted" },
                { "-name": "tei_model.pPart.data" },
                { "-name": "tei_model.pPart.edit" },
                { "-name": "tei_model.segLike" },
                { "-name": "tei_model.ptrLike" },
                { "-name": "tei_model.biblPart" },
                { "-name": "tei_model.global" }
              ]
            }
          },
          "ref": [
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.declarable.attributes" },
            { "-name": "tei_att.typed.attributes" },
            { "-name": "tei_att.sortable.attributes" }
          ]
        }
      },
      {
        "-name": "tei_fileDesc",
        "element": {
          "-name": "fileDesc",
          "a:documentation": "(file description) contains a full bibliographic description of an electronic file. [2.2. 2.1.1. ]",
          "group": {
            "group": {
              "ref": [
                { "-name": "tei_titleStmt" },
                { "-name": "tei_publicationStmt" }
              ],
              "optional": [
                {

                },
                {

                },
                {

                },
                {

                }
              ]
            },
            "oneOrMore": {
              "ref": { "-name": "tei_sourceDesc" }
            }
          },
          "ref": { "-name": "tei_att.global.attributes" }
        }
      },
      {
        "-name": "tei_titleStmt",
        "element": {
          "-name": "titleStmt",
          "a:documentation": "(title statement) groups information about the title of a work and those responsible for its intellectual content. [2.2.1. 2.2. ]",
          "group": {
            "oneOrMore": {
              "ref": { "-name": "tei_title" }
            },
            "zeroOrMore": {
              "ref": { "-name": "tei_model.respLike" }
            }
          },
          "ref": { "-name": "tei_att.global.attributes" }
        }
      },
      {
        "-name": "tei_publicationStmt",
        "element": {
          "-name": "publicationStmt",
          "a:documentation": "(publication statement) groups information concerning the publication or distribution of an electronic or other text. [2.2.4. 2.2. ]",
          "choice": {
            "oneOrMore": [
              {
                "ref": { "-name": "tei_model.pLike" }
              },
              {
                "ref": { "-name": "tei_model.publicationStmtPart" }
              }
            ]
          },
          "ref": { "-name": "tei_att.global.attributes" }
        }
      },
      {
        "-name": "tei_sourceDesc",
        "element": {
          "-name": "sourceDesc",
          "a:documentation": "(source description) describes the source from which an electronic text was derived or generated, typically a bibliographic description in the case of a digitized text, or a phrase such as \"born digital\" for a text which has no previous existence. [2.2.7. ]",
          "choice": {
            "oneOrMore": [
              {
                "ref": { "-name": "tei_model.pLike" }
              },
              {
                "choice": {
                  "ref": [
                    { "-name": "tei_model.biblLike" },
                    { "-name": "tei_model.sourceDescPart" },
                    { "-name": "tei_model.listLike" }
                  ]
                }
              }
            ]
          },
          "ref": { "-name": "tei_att.global.attributes" }
        }
      },
      {
        "-name": "tei_att.datable.custom.attributes",
        "ref": [
          { "-name": "tei_att.datable.custom.attribute.when-custom" },
          { "-name": "tei_att.datable.custom.attribute.notBefore-custom" },
          { "-name": "tei_att.datable.custom.attribute.notAfter-custom" },
          { "-name": "tei_att.datable.custom.attribute.from-custom" },
          { "-name": "tei_att.datable.custom.attribute.to-custom" },
          { "-name": "tei_att.datable.custom.attribute.datingPoint" },
          { "-name": "tei_att.datable.custom.attribute.datingMethod" }
        ]
      },
      {
        "-name": "tei_att.datable.custom.attribute.when-custom",
        "optional": {
          "attribute": {
            "-name": "when-custom",
            "a:documentation": "supplies the value of a date or time in some standard form.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.notBefore-custom",
        "optional": {
          "attribute": {
            "-name": "notBefore-custom",
            "a:documentation": "specifies the earliest possible date for the event in some custom standard form.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.notAfter-custom",
        "optional": {
          "attribute": {
            "-name": "notAfter-custom",
            "a:documentation": "specifies the latest possible date for the event in some custom standard form.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.from-custom",
        "optional": {
          "attribute": {
            "-name": "from-custom",
            "a:documentation": "indicates the starting point of the period in some standard form.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.to-custom",
        "optional": {
          "attribute": {
            "-name": "to-custom",
            "a:documentation": "indicates the ending point of the period in some standard form.",
            "list": {
              "ref": { "-name": "tei_data.word" },
              "zeroOrMore": {
                "ref": { "-name": "tei_data.word" }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.datingPoint",
        "optional": {
          "attribute": {
            "-name": "datingPoint",
            "a:documentation": "supplies a pointer to some location defining a named point in time with reference to which the datable item is understood to have occurred",
            "ref": { "-name": "tei_data.pointer" }
          }
        }
      },
      {
        "-name": "tei_att.datable.custom.attribute.datingMethod",
        "optional": {
          "attribute": {
            "-name": "datingMethod",
            "a:documentation": "supplies a pointer to a calendarDesc element or other means of interpreting the values of the custom dating attributes.",
            "ref": { "-name": "tei_data.pointer" }
          }
        }
      },
      {
        "-name": "tei_orgName",
        "element": {
          "-name": "orgName",
          "a:documentation": "(organization name) contains an organizational name. [13.2.2. ]",
          "ref": [
            { "-name": "tei_macro.phraseSeq" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.datable.attributes" },
            { "-name": "tei_att.editLike.attributes" },
            { "-name": "tei_att.personal.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ]
        }
      },
      {
        "-name": "tei_persName",
        "element": {
          "-name": "persName",
          "a:documentation": "(personal name) contains a proper noun or proper-noun phrase referring to a person, possibly including any or all of the person's forenames, surnames, honorifics, added names, etc. [13.2.1. ]",
          "ref": [
            { "-name": "tei_macro.phraseSeq" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.datable.attributes" },
            { "-name": "tei_att.editLike.attributes" },
            { "-name": "tei_att.personal.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ]
        }
      },
      {
        "-name": "tei_placeName",
        "element": {
          "-name": "placeName",
          "a:documentation": "contains an absolute or relative place name. [13.2.3. ]",
          "ref": [
            { "-name": "tei_macro.phraseSeq" },
            { "-name": "tei_att.datable.attributes" },
            { "-name": "tei_att.editLike.attributes" },
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.naming.attributes" },
            { "-name": "tei_att.typed.attributes" }
          ]
        }
      },
      {
        "-name": "tei_org",
        "element": {
          "-name": "org",
          "a:documentation": "(organization) provides information about an identifiable organization such as a business, a tribe, or any other grouping of people. [13.2.2. ]",
          "group": {
            "zeroOrMore": [
              {
                "ref": { "-name": "tei_model.headLike" }
              },
              {
                "choice": {
                  "ref": [
                    { "-name": "tei_model.noteLike" },
                    { "-name": "tei_model.biblLike" }
                  ]
                }
              },
              {
                "ref": { "-name": "tei_model.personLike" }
              }
            ],
            "choice": {
              "zeroOrMore": [
                {
                  "ref": { "-name": "tei_model.pLike" }
                },
                {
                  "choice": {
                    "ref": [
                      { "-name": "tei_model.labelLike" },
                      { "-name": "tei_model.nameLike" },
                      { "-name": "tei_model.placeLike" },
                      { "-name": "tei_model.orgPart" }
                    ]
                  }
                }
              ]
            }
          },
          "ref": [
            { "-name": "tei_att.global.attributes" },
            { "-name": "tei_att.typed.attributes" },
            { "-name": "tei_att.editLike.attributes" },
            { "-name": "tei_att.sortable.attributes" }
          ],
          "optional": {
            "attribute": {
              "-name": "role",
              "a:documentation": "specifies a primary role or classification for the organization.",
              "list": {
                "ref": { "-name": "tei_data.word" },
                "zeroOrMore": {
                  "ref": { "-name": "tei_data.word" }
                }
              }
            }
          }
        }
      },
      {
        "-name": "tei_att.datable.iso.attributes",
        "ref": [
          { "-name": "tei_att.datable.iso.attribute.when-iso" },
          { "-name": "tei_att.datable.iso.attribute.notBefore-iso" },
          { "-name": "tei_att.datable.iso.attribute.notAfter-iso" },
          { "-name": "tei_att.datable.iso.attribute.from-iso" },
          { "-name": "tei_att.datable.iso.attribute.to-iso" }
        ]
      },
      {
        "-name": "tei_att.datable.iso.attribute.when-iso",
        "optional": {
          "attribute": {
            "-name": "when-iso",
            "a:documentation": "supplies the value of a date or time in a standard form.",
            "ref": { "-name": "tei_data.temporal.iso" }
          }
        }
      },
      {
        "-name": "tei_att.datable.iso.attribute.notBefore-iso",
        "optional": {
          "attribute": {
            "-name": "notBefore-iso",
            "a:documentation": "specifies the earliest possible date for the event in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.iso" }
          }
        }
      },
      {
        "-name": "tei_att.datable.iso.attribute.notAfter-iso",
        "optional": {
          "attribute": {
            "-name": "notAfter-iso",
            "a:documentation": "specifies the latest possible date for the event in standard form, e.g. yyyy-mm-dd.",
            "ref": { "-name": "tei_data.temporal.iso" }
          }
        }
      },
      {
        "-name": "tei_att.datable.iso.attribute.from-iso",
        "optional": {
          "attribute": {
            "-name": "from-iso",
            "a:documentation": "indicates the starting point of the period in standard form.",
            "ref": { "-name": "tei_data.temporal.iso" }
          }
        }
      },
      {
        "-name": "tei_att.datable.iso.attribute.to-iso",
        "optional": {
          "attribute": {
            "-name": "to-iso",
            "a:documentation": "indicates the ending point of the period in standard form.",
            "ref": { "-name": "tei_data.temporal.iso" }
          }
        }
      }
    ],
    "start": {

    },
  "elements" :   ['p', 'name', 'date', 'note', 'title', 'bibl', 'fileDesc', 'titleStmt', 'publicationStmt', 'sourceDesc', 'orgName', 'persName', 'placeName', 'org', ],
  "attributes":  ['key', 'ref', 'atLeast', 'atMost', 'min', 'max', 'confidence', 'unit', 'quantity', 'extent', 'precision', 'scope', 'when', 'notBefore', 'notAfter', 'from', 'to', 'calendar', 'period', 'default', 'cert', 'resp', 'evidence', 'source', 'instant', 'xml:id', 'n', 'xml:lang', 'rendition', 'role', 'nymRef', 'place', 'type', 'subtype', 'target', 'evaluate', 'sortKey', 'full', 'sort', 'anchored', 'targetEnd', 'type', 'when-custom', 'notBefore-custom', 'notAfter-custom', 'from-custom', 'to-custom', 'datingPoint', 'datingMethod', 'role', 'when-iso', 'notBefore-iso', 'notAfter-iso', 'from-iso', 'to-iso', ]

  }
}]