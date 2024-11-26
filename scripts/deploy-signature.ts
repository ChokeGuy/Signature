import { ethers } from 'hardhat';

async function main() {
  const addr = await deploy();

  await verify(addr);
}

async function deploy(): Promise<string> {
  const Signature = await ethers.getContractFactory('Signature');
  const signature = await Signature.deploy();

  console.log('Signature deploy....');
  await signature.waitForDeployment();

  const addr = await signature.getAddress();

  console.log('Signature deploy to: ', addr);

  return addr;
}

async function verify(address: string) {
  const [...signers] = await ethers.getSigners();

  const contract = await ethers.getContractAt('Signature', address);

  const amount = 1000;

  const amountHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [amount]),
  );
  const amountHashBytes = ethers.toBeArray(amountHash);

  const sig = await signers[0].signMessage(amountHashBytes);

  await contract.connect(signers[1]).getToken(amount, sig);

  console.log(
    'User Balance: ',
    Number(await contract.balanceOf(signers[1].address)),
    'token',
  );
  console.log('Result: ', Number(await contract.totalAmount()), 'token');
}

main().catch(console.error);
