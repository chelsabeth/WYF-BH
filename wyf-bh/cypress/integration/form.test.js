describe("test our form", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/form");
    })
    it("add text to input to name", () => {
        cy.get('input[name="name"]')
        .type("Chelsea")
        .should("have.value", "Chelsea");
        cy.get('input[name="email"]')
        .type("123@gmail")
        .should("have.value", "123@gmail");
        cy.get("textarea")
        .type("Cherry Coke")
        .should("have.value", "Cherry Coke");
    })
})