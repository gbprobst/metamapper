const getCommentByText = (commentText) => {
  return cy.contains(commentText).parentsUntil(".comment")
}

describe("table_column_comments.spec.js", () => {
  const workspace = {
    id: "d6acb06747514d17b74f21e7b00c95a4",
    slug: "gcc",
  }

  const owner = {
    name: "Jeff Winger",
    email: "owner.definitions@metamapper.test",
    password: "password1234",
  }

  const member = {
    email: "member.definitions@metamapper.test",
    password: "password1234",
  }

  const readonly = {
    email: "readonly.definitions@metamapper.test",
    password: "password1234",
  }

  const datastore = {
    name: "Metamapper",
    slug: "metamapper",
  }

  const table = {
    schema: "public",
    name: "votes",
  }

  const columnId = "Q29sdW1uVHlwZTo1OTI="

  const databaseUri = `/${workspace.slug}/datastores/${datastore.slug}`
  const overviewUri = `${databaseUri}/definition/${table.schema}/${table.name}/columns`

  let commentOne = "Here is some information about this table."
  let commentTwo = "Here is an unrelated comment."

  describe("as member", () => {
    beforeEach(() => {
      cy.login(member.email, member.password, workspace.id)
         .then(() => cy.visit(overviewUri))
         .then(() => cy.wait(1500))

      cy.getByTestId("ColumnDefinitionTable").find("tr").eq(1).within(() => {
        cy.get("td").eq(1).then(() => cy.get(".column-comments-icon").click({ force: true }))
      })

      cy.getByTestId(
        "ColumnDefinitionDetails.Navigation(Discussion)"
      ).click()
    })

    it("can create comment", () => {
      [commentOne, commentTwo].forEach(commentText => {
        cy.getByTestId("CreateComment").find(".ql-editor").type(commentText)
        cy.getByTestId("CreateComment.Submit").click()

        cy.contains(".ant-message-success", "Comment has been added.").should(
          "be.visible"
        )

        cy.contains(commentText).should("be.visible")
      })

      cy.wait(1500)

      cy.reload()

      cy.getByTestId("ColumnDefinitionTable").find("tr").eq(1).within(() => {
        cy.get("td").eq(0).then(() => cy.get(".column-comments-icon").should("be.visible"))
      })
    })

    it("can vote for comment", () => {
      getCommentByText(commentTwo).within(() => {
        cy.getByTestId("VoteForComment.UP").contains("0")
        cy.getByTestId("VoteForComment.DOWN").contains("0")

        cy.getByTestId("VoteForComment.UP.Submit").click().then(() => cy.wait(1500))

        cy.getByTestId("VoteForComment.UP").contains("1")
        cy.getByTestId("VoteForComment.DOWN").contains("0")
      })

      getCommentByText(commentOne).within(() => {
        cy.getByTestId("VoteForComment.UP").contains("0")
        cy.getByTestId("VoteForComment.DOWN").contains("0")
      })
    })

    it ("can reply to a comment", () => {
      const commentText = "Alright, alright, alright."

      getCommentByText(commentOne).within(() => {
        cy.contains("reply").click()

        cy.getByTestId("CreateComment").find(".ql-editor").type(commentText)
        cy.getByTestId("CreateComment.Submit").click()

        cy.contains(commentText)
      })

      cy.contains(".ant-message-success", "Comment has been added.").should(
        "be.visible"
      )
    })

    it("can edit comment", () => {
      const commentText = "This comment has changed. It is now different."

      getCommentByText(commentTwo).within(() => {
        cy.contains("edit").click()

        cy.getByTestId("UpdateComment").find(".ql-editor").clear().type(commentText)
        cy.getByTestId("UpdateComment.Submit").click()
        cy.getByTestId("UpdateComment.Submit").should("be.disabled")
      })

      cy.wait(1000)

      getCommentByText(commentText).within(() => {
        cy.getByTestId("UpdateComment.Submit").should("not.be.visible")
        cy.contains(commentText)
      })

      commentTwo = commentText
    })

    it("can pin comment", () => {
      getCommentByText(commentOne).within(() => cy.contains("pin").click())

      cy.get(".ant-popover-content").should("be.visible").within(() =>
        cy.contains("Yes").click())

      getCommentByText(commentOne).parent().should("have.class", "pinned")
      getCommentByText(commentOne).parent().contains("Pinned by")
    })
  })

  describe("as another team member", () => {
    beforeEach(() => {
      cy.login(owner.email, owner.password, workspace.id)
        .then(() => cy.visit(`${overviewUri}?selectedColumn=${columnId}`))
        .then(() => cy.wait(1500))

      cy.getByTestId(
        "ColumnDefinitionDetails.Navigation(Discussion)"
      ).click()
    })

    it("can reply to a comment", () => {
      const commentText = "Party at the moon tower!"

      getCommentByText(commentOne).within(() => {
        cy.contains("reply").click()

        cy.getByTestId("CreateComment").find(".ql-editor").type(commentText)
        cy.getByTestId("CreateComment.Submit").click()

        cy.contains(commentText)
      })

      cy.contains(".ant-message-success", "Comment has been added.").should(
        "be.visible"
      )

      cy.get(".comment").should("have.length", 3)
    })

    it("can unpin comments", () => {
      getCommentByText(commentOne).within(() => cy.contains("unpin").click())

      cy.get(".ant-popover-content").should("be.visible").within(() =>
        cy.contains("Yes").click())

      getCommentByText(commentOne).parent().should("not.have.class", "pinned")
    })

    it("can vote for a comment", () => {
      getCommentByText(commentTwo).within(() => {
        cy.getByTestId("VoteForComment.UP").contains("1")
        cy.getByTestId("VoteForComment.UP.Submit").click().then(() => cy.wait(1500))
        cy.getByTestId("VoteForComment.UP").contains("2")
      })
    })

    it("cannot edit a comment by someone else", () => {
      getCommentByText(commentTwo).within(() => cy.getByTestId("Comment.Edit").should("not.be.visible"))
    })

    it("cannot delete a comment by someone else", () => {
      getCommentByText(commentTwo).within(() => cy.getByTestId("DeleteComment.Submit").should("not.be.visible"))
    })
  })

  describe("as readonly", () => {
    beforeEach(() => {
      cy.login(readonly.email, readonly.password, workspace.id)
        .then(() => cy.visit(`${overviewUri}?selectedColumn=${columnId}`))
        .then(() => cy.wait(1500))

      cy.getByTestId(
        "ColumnDefinitionDetails.Navigation(Discussion)"
      ).click()
    })

    it("cannot create comment", () => {
      cy.getByTestId("CreateComment.Submit").should("be.disabled")
    })

    it("cannot edit comment", () => {
      getCommentByText(commentOne).within(() => cy.getByTestId("Comment.Edit").should("not.be.visible"))
    })

    it("cannot reply to a comment", () => {
      getCommentByText(commentOne).within(() => cy.contains("Comment.Reply").should("not.be.visible"))
    })

    it("cannot delete comment", () => {
      getCommentByText(commentOne).within(() => cy.getByTestId("DeleteComment.Submit").should("not.be.visible"))
    })
  })

  describe("final thoughts", () => {
    beforeEach(() => {
      cy.login(member.email, member.password, workspace.id)
        .then(() => cy.visit(`${overviewUri}?selectedColumn=${columnId}`))
        .then(() => cy.wait(1500))

      cy.getByTestId(
        "ColumnDefinitionDetails.Navigation(Discussion)"
      ).click()
    })

    it("can delete childless comment", () => {
      getCommentByText(commentTwo).within(() =>
        cy.contains("delete").click())

      cy.get(".ant-popover-content").should("be.visible").within(() =>
        cy.contains("Yes").click())

      cy.contains(commentTwo).should("not.be.visible")
    })

    it("can delete parent comments", () => {
      getCommentByText(commentOne).within(() =>
        cy.contains("delete").click())

      cy.get(".ant-popover-content").should("be.visible").within(() =>
        cy.contains("Yes").click())

      cy.contains(commentOne).should("not.be.visible")
    })
  })
})
