import React from "react";
import cookie from "cookie";
import intl from "../src/index";
import zhCN from "./locales/zh-CN";
import enUS from "./locales/en-US";
import enUSMore from "./locales/en-US-more";

const locales = {
  "en-US": enUS,
  "zh-CN": zhCN
};

test("Set specific locale", () => {
  intl.init({ locales, currentLocale: "zh-CN" });
  expect(intl.get("SIMPLE")).toBe("简单");
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("SIMPLE")).toBe("Simple");
});

test("Message with variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("HELLO", { name: "Tony" })).toBe("Hello, Tony");
});

test("Set specific locale with nested notation", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("NESTED.HELLO")).toBe("Hello World");
  expect(intl.get("NESTED.HELLO_NAME", { name: "World" })).toBe("Hello, World");
});

test("react-intl mirror API formatMessage:variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  const name = "Tony";
  expect(
    intl.formatMessage(
      { id: "HELLO", defaultMessage: `Hello, {name}` },
      { name }
    )
  ).toBe(intl.get("HELLO", { name }));
});

test("react-intl mirror API formatMessage:defaultMessage", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.formatMessage({ id: "not-exist-key" })).toBe(
    intl.get("not-exist-key")
  );
});

test("react-intl mirror API formatHTMLMessage:variable", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.formatHTMLMessage(
    { id: "TIP_VAR", defaultMessage: React.createElement("div") },
    {
      message: "your message"
    }
  );
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is<span>your message</span>"
  );
});

test("react-intl mirror API formatHTMLMessage:defaultMessage", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.formatHTMLMessage({
    id: "not-exist-key",
    defaultMessage: React.createElement("div", {className: 'test'})
  });

  expect(reactEl.type).toBe('div');
  expect(reactEl.props.className).toBe('test');

});

test("HTML Message without variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.getHTML("TIP");
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is <span>HTML</span>"
  );
});

test("HTML Message with variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.getHTML("TIP_VAR", { message: "your message" });
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is<span>your message</span>"
  );
});

test("HTML Message without variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.getHTML("TIP");
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is <span>HTML</span>"
  );
});

test("HTML Message with variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.getHTML("TIP_VAR", {
    message: "your message"
  });
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is<span>your message</span>"
  );
});

test("HTML Message with XSS attack", () => {
  intl.init({ locales, currentLocale: "en-US" });
  let reactEl = intl.getHTML("TIP_VAR", {
    message: "<sctipt>alert(1)</script>"
  });
  expect(reactEl.props.dangerouslySetInnerHTML.__html).toBe(
    "This is<span>&lt;sctipt&gt;alert(1)&lt;/script&gt;</span>"
  );
});

test("Message with Date", () => {
  let start = new Date("Fri Apr 07 2017 17:08:33");
  intl.init({ locales, currentLocale: "en-US" });
  expect(
    intl.get("SALE_START", {
      start: start
    })
  ).toBe("Sale begins 4/7/2017");
  expect(
    intl.get("SALE_END", {
      start: start
    })
  ).toBe("Sale begins April 7, 2017");
});

test("Message with Time", () => {
  let expires = new Date("Fri Apr 07 2017 17:08:33");
  intl.init({ locales, currentLocale: "en-US" });
  expect(
    intl.get("COUPON", {
      expires: expires
    })
  ).toBe("Coupon expires at 5:08:33 PM");
  intl.init({ locales, currentLocale: "zh-CN" });
  expect(
    intl.get("COUPON", {
      expires: expires
    })
  ).toBe("优惠卷将在17:08:33过期");
});

test("Message with Currency", () => {
  let price = 123456.78;
  intl.init({ locales, currentLocale: "en-US" });
  expect(
    intl.get("SALE_PRICE", {
      price: price
    })
  ).toBe("The price is $123,456.78");
  intl.init({ locales, currentLocale: "zh-CN" });
  expect(
    intl.get("SALE_PRICE", {
      price: price
    })
  ).toBe("售价¥123,456.78");
});

test("Message with plural", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(
    intl.get("PHOTO", {
      num: 0
    })
  ).toBe("You have no photos.");
  expect(
    intl.get("PHOTO", {
      num: 1
    })
  ).toBe("You have one photo.");
  expect(
    intl.get("PHOTO", {
      num: 10
    })
  ).toBe("You have 10 photos.");

  intl.init({ locales, currentLocale: "zh-CN" });
  expect(
    intl.get("PHOTO", {
      num: 1
    })
  ).toBe("你有1张照片");
});

test("Without default message, just return empty string", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("not-exist-key")).toBe("");
});

test("Should call handler when message is not defined", () => {
  const warningHandler = jest.fn();
  intl.init({ 
    locales, currentLocale: "en-US",
    warningHandler
  });
  intl.get("not-exist-key");
  expect(warningHandler).lastCalledWith('react-intl-universal key \"not-exist-key\" not defined in en-US');
});

test("Default message", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("not-exist-key").defaultMessage("this is default msg")).toBe(
    "this is default msg"
  );
  expect(intl.get("not-exist-key").d("this is default msg")).toBe(
    "this is default msg"
  );
});

test("Default message with nested key", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("NOT_EXIST_KEY.HELLO").defaultMessage("Hello World")).toBe("Hello World");
});

test("Default message", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("not-exist-key").defaultMessage("this is default msg")).toBe(
    "this is default msg"
  );
});

test("Default HTML message", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(
    intl.getHTML("not-exist-key").defaultMessage("this is default msg")
  ).toBe("this is default msg");
});

test("Get locale from cookie", () => {
  document.cookie = cookie.serialize("lang", "en-US");
  expect(intl.getLocaleFromCookie({ cookieLocaleKey: "lang" })).toBe("en-US");
});

test("Get locale from URL", () => {
  expect(intl.getLocaleFromURL({ urlLocaleKey: "lang" })).toBe(undefined);

  // change url in jsdom: https://github.com/facebook/jest/issues/890
  Object.defineProperty(window.location, "search", {
    writable: true,
    value: "?lang=en-US"
  });
  expect(intl.getLocaleFromURL({ urlLocaleKey: "lang" })).toBe("en-US");
});

test("Get locale from browser", () => {
  expect(intl.getLocaleFromBrowser()).toBe("en-US");
});

test("Determine Locale", () => {
  expect(intl.determineLocale()).toBe("en-US");
  document.cookie = cookie.serialize("lang", "zh-CN");
  expect(intl.determineLocale({ cookieLocaleKey: "lang" })).toBe("zh-CN");
});

test("Get dot key variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("DOT.HELLO")).toBe("Hello World");
});

test("Get init options", () => {
  intl.init({ locales, currentLocale: "en-US" });
  const { currentLocale } = intl.getInitOptions();
  expect(currentLocale).toBe("en-US");
});

test("load mutiple locale data without overriding existing one", () => {
  intl.init({ locales, currentLocale: "en-US" });
  const localesMore = {
    "en-US": enUSMore,
  };
  intl.load(localesMore); 
  expect(intl.get("SIMPLE")).toBe("Simple");
  expect(intl.get("MORE")).toBe("More data");
});

test("Should handle IntlMessageFormat errors gracefully", () => {
  const warningHandler = jest.fn();
  intl.init({ 
    locales: {
      "en-US": {
        "INVALID_FORMAT": "This is {invalid format"
      }
    }, 
    currentLocale: "en-US",
    warningHandler
  });
  
  const result = intl.get("INVALID_FORMAT", { name: "test" });
  expect(result).toBe("");
  expect(warningHandler).toHaveBeenCalledWith(
    expect.stringContaining("react-intl-universal format message failed for key='INVALID_FORMAT'"),
    expect.any(Error)
  );
});

test("Should warn when language is not supported", () => {
  const warningHandler = jest.fn();
  
  // Mock browser environment
  const originalIsBrowser = global.window;
  global.window = {};
  
  return intl.init({ 
    locales: { "xx-XX": { "TEST": "test" } }, 
    currentLocale: "xx-XX",
    warningHandler,
    commonLocaleDataUrls: {} // Empty to simulate unsupported language
  }).then(() => {
    expect(warningHandler).toHaveBeenCalledWith('lang "xx" is not supported.');
    
    // Restore original state
    if (originalIsBrowser) {
      global.window = originalIsBrowser;
    } else {
      delete global.window;
    }
  });
});

test("Should resolve immediately in Node.js environment", () => {
  const warningHandler = jest.fn();
  
  // Ensure we're in Node.js environment (no window)
  const originalWindow = global.window;
  delete global.window;
  
  return intl.init({ 
    locales: { "en-US": { "TEST": "test" } }, 
    currentLocale: "en-US",
    warningHandler,
    commonLocaleDataUrls: { "en": "http://example.com/en.js" } // Provide URL to avoid warning
  }).then(() => {
    // In Node.js environment, it should resolve without trying to load scripts
    // The warning handler should not be called for unsupported language
    
    // Restore original state
    if (originalWindow) {
      global.window = originalWindow;
    }
  });
});

test("Should handle getDescendantProp with undefined values", () => {
  intl.init({ locales, currentLocale: "en-US" });
  
  // Test with a key that has undefined intermediate values
  const result = intl.get("UNDEFINED.NESTED.KEY");
  expect(result).toBe("");
});

test("Should handle empty variables object", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("SIMPLE", {})).toBe("Simple");
});

test("Should handle null variables", () => {
  intl.init({ locales, currentLocale: "en-US" });
  expect(intl.get("SIMPLE", null)).toBe("Simple");
});

test("Should return empty string when locales is not available", () => {
  intl.init({ locales: {}, currentLocale: "en-US" });
  expect(intl.get("SIMPLE")).toBe("");
});

test("Should return empty string when currentLocale is not in locales", () => {
  intl.init({ locales: { "fr-FR": { "TEST": "test" } }, currentLocale: "en-US" });
  expect(intl.get("SIMPLE")).toBe("");
});

test("Should handle browser environment with successful script loading", () => {
  const warningHandler = jest.fn();
  
  // Mock browser environment
  const originalWindow = global.window;
  global.window = {};
  
  return intl.init({ 
    locales: { "en-US": { "TEST": "test" } }, 
    currentLocale: "en-US",
    warningHandler
  }).then(() => {
    // Should resolve successfully in browser environment
    expect(warningHandler).not.toHaveBeenCalledWith(expect.stringContaining("not supported"));
    
    // Restore original state
    if (originalWindow) {
      global.window = originalWindow;
    } else {
      delete global.window;
    }
  });
});
