"use strict";

const assert = require("node:assert/strict");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const email_pill = zrequire("email_pill");

run_test("get_current_emails", () => {
    let current_text = null;
    const mock_pill_container = {
        getCurrentText: () => current_text,
    };

    // No pending text.
    assert.equal(email_pill.get_current_emails(mock_pill_container), null);

    // A single valid email address.
    current_text = "alice@example.com";
    assert.equal(email_pill.get_current_emails(mock_pill_container), "alice@example.com");

    // A comma-separated list of addresses, as one might type
    // without pressing Enter in between.
    current_text = "alice@example.com, bob@example.com";
    assert.equal(
        email_pill.get_current_emails(mock_pill_container),
        "alice@example.com, bob@example.com",
    );

    // Addresses with display names, including one with a comma
    // inside the display name.
    current_text = '"Alice Smith" <alice@example.com>, "Doe, John" <john@example.com>';
    assert.equal(
        email_pill.get_current_emails(mock_pill_container),
        '"Alice Smith" <alice@example.com>, "Doe, John" <john@example.com>',
    );

    // Invalid input.
    current_text = "not-an-email";
    assert.equal(email_pill.get_current_emails(mock_pill_container), null);

    // A list with an invalid address in it does not validate.
    current_text = "alice@example.com, not-an-email";
    assert.equal(email_pill.get_current_emails(mock_pill_container), null);
});
