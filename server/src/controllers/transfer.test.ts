import assert from "assert";
import { Transfer } from "../entities";
import { existsActiveTransfer, getReaminingSecs } from "./transfer";

describe("Transfer controller", function () {
  describe("Active transfers time tests", function () {
    it("should return false when expired transfer present.", function () {
      const transferDate = new Date();
      transferDate.setMinutes(transferDate.getMinutes() - 30);
      const transfer = new Transfer();
      transfer.createdAt = transferDate;
      transfer.duration = 20;
      const transfersInMemory = [transfer];

      assert.equal(existsActiveTransfer(transfersInMemory), false);
    });

    it("should return false with only expired transfers present.", function () {
      const transferDate1 = new Date();
      transferDate1.setMinutes(transferDate1.getMinutes() - 20);
      const transferDate2 = transferDate1;
      transferDate2.setMinutes(transferDate2.getMinutes() - 10);
      const transfer1 = new Transfer();

      transfer1.createdAt = transferDate1;
      transfer1.duration = 10;
      const transfer2 = new Transfer();
      transfer2.createdAt = transferDate2;
      transfer2.duration = 20;
      const transfersInMemory = [transfer1, transfer2];

      assert.equal(existsActiveTransfer(transfersInMemory), false);
    });

    it("should return true when active transfer present.", function () {
      const transferDate = new Date();
      transferDate.setMinutes(transferDate.getMinutes() - 30);

      const transfer = new Transfer();
      transfer.createdAt = transferDate;
      transfer.duration = 40;
      const transfersInMemory = [transfer];

      assert.equal(existsActiveTransfer(transfersInMemory), true);
    });

    it("should return true when at least one active transfer present.", function () {
      const transferDate1 = new Date();
      transferDate1.setMinutes(transferDate1.getMinutes() - 20);
      const transferDate2 = transferDate1;
      transferDate2.setMinutes(transferDate2.getMinutes() - 10);
      const transfer1 = new Transfer();

      transfer1.createdAt = transferDate1;
      transfer1.duration = 10;
      const transfer2 = new Transfer();
      transfer2.createdAt = transferDate2;
      transfer2.duration = 30;
      const transfersInMemory = [transfer1, transfer2];

      assert.equal(existsActiveTransfer(transfersInMemory), true);
    });
  });

  describe("Seconds remaining tests", function () {
    it("should return 600 seconds.", function () {
      const transferDate = new Date();
      transferDate.setMinutes(transferDate.getMinutes() - 10);
      const transfer = new Transfer();
      transfer.createdAt = transferDate;
      transfer.duration = 20;

      assert.equal(getReaminingSecs(transfer), 600);
    });
    it("should return 300 seconds.", function () {
      const transferDate = new Date();
      transferDate.setMinutes(transferDate.getMinutes() - 40);
      const transfer = new Transfer();
      transfer.createdAt = transferDate;
      transfer.duration = 45;

      assert.equal(getReaminingSecs(transfer), 300);
    });
  });
});
