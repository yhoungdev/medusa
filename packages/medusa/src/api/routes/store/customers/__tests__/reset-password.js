import { IdMap } from "medusa-test-utils"
import jwt from "jsonwebtoken"
import { request } from "../../../../../helpers/test-request"
import { CustomerServiceMock } from "../../../../../services/__mocks__/customer"

describe("POST /store/customers/password-reset", () => {
  describe("successfully creates a customer", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/password-reset`, {
        payload: {
          email: "lebron@james.com",
          token: jwt.sign({ customer_id: IdMap.getId("lebron") }, "1234"),
          password: "TheGame",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls CustomerService create", () => {
      expect(CustomerServiceMock.update).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("lebron"),
        {
          password: "TheGame",
        }
      )
    })

    it("returns customer decorated", () => {
      expect(subject.body.email).toEqual("lebron@james.com")
      expect(subject.body.decorated).toEqual(true)
    })
  })

  describe("fails if id in webtoken not matching", () => {
    let subject
    beforeAll(async () => {
      subject = await request("POST", `/store/customers/password-reset`, {
        payload: {
          email: "lebron@james.com",
          token: jwt.sign({ customer_id: IdMap.getId("not-lebron") }, "1234"),
          password: "TheGame",
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("fails", () => {
      expect(subject.status).toEqual(401)
    })
  })
})