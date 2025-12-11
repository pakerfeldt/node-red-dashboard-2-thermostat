module.exports = function(RED) {
    /**
     * Validates and clamps a numeric value to a specified range
     * @param {*} value - The value to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @param {number} defaultValue - Default value if validation fails
     * @returns {{valid: boolean, value: number}} Validation result with clamped value
     */
    function validateNumericRange(value, min, max, defaultValue) {
        const num = parseFloat(value)
        if (isNaN(num)) {
            return { valid: false, value: defaultValue }
        }
        return { valid: true, value: Math.min(Math.max(num, min), max) }
    }

    function UIThermostatNode(config) {
        RED.nodes.createNode(this, config)

        const node = this

        const group = RED.nodes.getNode(config.group)

        if (!group) {
            node.error('No group configured')
            return
        }

        const base = group.getBase()

        const evts = {
            onAction: true,
            beforeSend: function(msg) {
                if (!msg.payload || typeof msg.payload !== 'object') {
                    msg.payload = {}
                }

                // Validate incoming temperature data
                if (msg.payload.currentTemp !== undefined) {
                    const result = validateNumericRange(msg.payload.currentTemp, -50, 100, 20)
                    if (!result.valid) {
                        node.warn(`Invalid currentTemp value: ${msg.payload.currentTemp}. Expected number between -50 and 100`)
                        msg.payload.currentTemp = result.value
                    }
                }

                if (msg.payload.targetTemp !== undefined) {
                    const result = validateNumericRange(msg.payload.targetTemp, 5, 50, 22)
                    if (!result.valid) {
                        node.warn(`Invalid targetTemp value: ${msg.payload.targetTemp}. Expected number between 5 and 50`)
                        msg.payload.targetTemp = result.value
                    }
                }

                if (msg.payload.heatingPercent !== undefined) {
                    const result = validateNumericRange(msg.payload.heatingPercent, 0, 100, 0)
                    if (!result.valid) {
                        node.warn(`Invalid heatingPercent value: ${msg.payload.heatingPercent}. Expected number between 0 and 100`)
                        msg.payload.heatingPercent = result.value
                    }
                }

                return msg
            },
            onInput: function(msg, send, done) {
                // Store the incoming data
                base.stores.data.save(base, node, msg)
                
                // Pass through the message
                send(msg)
                
                if (done) {
                    done()
                }
            },
            onSocket: {
                'widget-action': function(conn, id, msg) {
                    // Handle user interactions from the widget
                    if (msg && msg.payload && msg.payload.targetTemp !== undefined) {
                        // Create a new message with the target temperature change
                        const actionMsg = {
                            payload: {
                                targetTemp: msg.payload.targetTemp,
                                source: 'user'
                            },
                            _msgid: RED.util.generateId()
                        }
                        
                        // Store the updated data
                        base.stores.data.save(base, node, actionMsg)
                        
                        // Send the message to the Node-RED flow
                        node.send(actionMsg)
                    }
                }
            }
        }

        group.register(node, config, evts)
    }

    RED.nodes.registerType('ui-thermostat', UIThermostatNode)
}