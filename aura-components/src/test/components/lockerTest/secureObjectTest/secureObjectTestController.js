({
    init : function(component) {
        var obj = {
                value1: '',
                sub: {
                    value2:''
                }
        };
        component.set('v.wrapUnwrapTestObj', obj);
    },

    createComponent : function(component, event, helper) {
        $A.createComponent("aura:text", { value: "Instance #" + helper._count++ }, function(cmp) {
            var content = component.find("content");
            var body = content.get("v.body");
            body.push(cmp);
            content.set("v.body", body);
            helper._createCmpCompletionCount++;
        });
    },

    deleteLastComponent : function(component, event, helper) {
        var content = component.find("content");
        var body = content.get("v.body");
        body.pop();
        content.set("v.body", body);
        helper._deleteLastComponentCount++;
    },

    deleteFirstComponent : function(component, event, helper) {
        var content = component.find("content");
        var body = content.get("v.body");
        body.shift();
        content.set("v.body", body);
        helper._deleteFirstComponentCount++;
    },

    checkWrapUnwrapObject: function(component) {
        var testUtils = component.get("v.testUtils");
        var obj = component.get("v.wrapUnwrapTestObj");
        testUtils.assertEquals("Value 1", obj.value1, "Unexpected value after object has been wrapped/unwrapped in SecureObject");
        testUtils.assertEquals("Value 2", obj.sub.value2, "Unexpected nested value after object has been wrapped/unwrapped in SecureObject");
    },

    setWrapUnwrapObject: function(component) {
        component.find("wrapUnwrapFacet").setValues();
    },

    testMethodWithParams: function(component) {
        var testUtils = component.get("v.testUtils");

        var callbackCalled = false;
        var facet = component.find("facet");
        facet.setCallback(function() {
            callbackCalled = true;
        });
        facet.executeCallback();

        testUtils.assertTrue(callbackCalled, "Function passed to facet via aura:method not successfully called");
    },

    testRawObjectsConstructorAndProperties: function(component) {
        var testUtils = component.get("v.testUtils");
        var href = "http://www.google.com/";
        var url = new URL(href);
        testUtils.assertDefined(url, "Could not construct RAW object (URL)");
        testUtils.assertEquals(href, url.href, "Expected property to exist on constructed RAW object (URL)");

        var blob = new Blob([]);
        var blobUrl = URL.createObjectURL(blob);
        testUtils.assertStartsWith("blob", blobUrl, "Static function URL.createObjectURL did not return expected value for blob");

        var textEncoder = new TextEncoder("UTF-8");
        testUtils.assertEquals("utf-8", textEncoder.encoding, "Unexpected encoding property from constructed TextEncoder");
        testUtils.assertDefined(textEncoder.encode, "Expected static method 'encode' to be defined on constructed TextEncoder");
    }
})