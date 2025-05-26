import { fakerEN_NG as faker } from '@faker-js/faker';
import { min, max } from 'moment';

let signup
let login
let serverID = 'ni5cajis'
let emailDomain = '@ni5cajis.mailosaur.net'
let busReg = faker.string.numeric({ length: { min: 5, max: 7 } });
let email
let emailAddress
beforeEach(() => {
    const checker = new Date().getTime()
    const emailSuffix = checker.toString().substring(6, 13);
    const emailPrefix = `test${emailSuffix}`
    emailAddress = `${emailPrefix}${emailDomain}`
    const userDetails = {
        emailAddress: emailAddress // convert the email to a json file
    }

    cy.writeFile('cypress/fixtures/creds.json', JSON.stringify(userDetails, null, 2))

    cy.fixture('elements').then((loc) => {
        signup = loc.signupPage
        login = loc.loginPage
    })
    cy.fixture('creds').then((cred) => {
        email = cred
    })
})

Cypress.Commands.add('read_email_file', (text) => {
  return  cy.readFile('cypress/fixtures/creds.json')
})

Cypress.Commands.add('fill_business_email', (text) => {
    cy.read_email_file().then((email)=>{
        cy.get(signup.businessEmailField).fill(email.emailAddress);
    })
})

Cypress.Commands.add('click_button', (text) => {
    cy.get('button').contains(text).click();
})

Cypress.Commands.add('click_any_element', (element) => {
    cy.get(element).click();
    signup.button
})

Cypress.Commands.add('fill_any_input_field', (field, text) => {
    cy.get(field).fill(text);
})

Cypress.Commands.add('fill_in_password', (text) => {
    cy.get(signup.passwordField).fill(text);
})

Cypress.Commands.add('fill_basic_info_and_business_reg', () => {

    const input = [
        faker.person.fullName(),
        faker.company.buzzNoun(),
        faker.phone.number({ style: 'international' }),
        faker.string.numeric({ length: { min: 5, max: 7 } }),
    ]
    cy.get(signup.fullNameField).fill(input[0])
    cy.get(signup.businessNameField).fill(input[1])
    cy.fill_business_email();
    cy.get(signup.businessPhoneField).fill(input[2])
    cy.get(signup.businessRegNumField).fill(input[3])
})

Cypress.Commands.add('how_you_heard_about_us', (text) => {
    cy.get(signup.howYouHeardAboutUs).click();
    cy.get(signup.HeardAboutUsList).contains(text).click();
})

Cypress.Commands.add('retrieve_and_insert_otp', () => {
    cy.mailosaurGetMessage(serverID, { sentTo: emailAddress })
        .then((email) => {
            cy.log(email.subject)
            const firstCode = email.html.codes[0]
            const otp = firstCode.value
            cy.log(firstCode)
            cy.log(otp)
            cy.get('input').each(($el, index) => {
                cy.wrap($el).type(otp[index]);
            })
        })
})

Cypress.Commands.add('fill_required_fields', () => {
    const input = [
        faker.person.fullName(),
        faker.company.buzzNoun(),
        faker.phone.number({ style: 'international' })
    ]
    cy.get(signup.fullNameField).fill(input[0])
    cy.get(signup.businessNameField).fill(input[1])
    cy.fill_business_email();
    cy.get(signup.businessPhoneField).fill(input[2])

})

Cypress.Commands.add('fill_any_optional_field', (optional) => {
    if (optional === 'business registration') {
        cy.fill_any_input_field(signup.businessRegNumField, busReg)
        cy.click_button('Next');
    }
    else if (optional === 'website') {
        cy.click_button('Next');
        cy.fill_any_input_field(signup.websiteField, 'www.google.com')
    }
    else if (optional === 'instagram') {
        cy.click_button('Next');
        cy.fill_any_input_field(signup.instagramField, 'Dele007')
    }
    else if (optional === 'twitter') {
        cy.click_button('Next');
        cy.fill_any_input_field(signup.twitterField, 'Dele007')
    }
})